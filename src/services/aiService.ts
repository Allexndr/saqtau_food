import * as tf from '@tensorflow/tfjs'
import * as use from '@tensorflow-models/universal-sentence-encoder'
import { Product, User } from '../types'

class AIService {
  private model: use.UniversalSentenceEncoder | null = null
  private embeddings: Map<string, tf.Tensor> = new Map()
  private isInitialized = false

  async initialize() {
    if (this.isInitialized) return

    try {
      console.log('🤖 Initializing AI service...')
      this.model = await use.load()
      this.isInitialized = true
      console.log('✅ AI service initialized successfully')
    } catch (error) {
      console.error('❌ Failed to initialize AI service:', error)
      throw error
    }
  }

  async generateEmbeddings(products: Product[]): Promise<void> {
    if (!this.isInitialized || !this.model) {
      await this.initialize()
    }

    try {
      console.log('🔄 Generating embeddings for products...')

      // Create text representations for products
      const productTexts = products.map(product =>
        `${product.title} ${product.description} ${product.tags.join(' ')} ${product.category} ${product.subcategory}`
      )

      // Generate embeddings
      const embeddings = await this.model!.embed(productTexts)

      // Store embeddings
      products.forEach((product, index) => {
        const embedding = tf.slice(embeddings, [index, 0], [1, -1])
        this.embeddings.set(product.id, embedding)
      })

      console.log(`✅ Generated embeddings for ${products.length} products`)
    } catch (error) {
      console.error('❌ Failed to generate embeddings:', error)
      throw error
    }
  }

  async getRecommendations(
    userId: string,
    allProducts: Product[],
    userPreferences?: {
      favoriteCategories?: string[]
      location?: { lat: number; lng: number }
      maxDistance?: number
    }
  ): Promise<Product[]> {
    if (!this.isInitialized) {
      await this.initialize()
    }

    try {
      // Filter products based on user preferences
      let filteredProducts = [...allProducts]

      // Filter by categories
      if (userPreferences?.favoriteCategories?.length) {
        filteredProducts = filteredProducts.filter(product =>
          userPreferences.favoriteCategories!.includes(product.category)
        )
      }

      // Filter by location/distance
      if (userPreferences?.location && userPreferences?.maxDistance) {
        filteredProducts = filteredProducts.filter(product => {
          const distance = this.calculateDistance(
            userPreferences.location!,
            product.location
          )
          return distance <= userPreferences.maxDistance!
        })
      }

      // If we have embeddings, use semantic similarity
      if (this.embeddings.size > 0 && filteredProducts.length > 1) {
        const recommendations = await this.getSemanticRecommendations(
          userId,
          filteredProducts
        )
        return recommendations
      }

      // Fallback: simple popularity-based recommendations
      return this.getPopularityBasedRecommendations(filteredProducts)
    } catch (error) {
      console.error('❌ Failed to get recommendations:', error)
      return this.getPopularityBasedRecommendations(allProducts)
    }
  }

  private async getSemanticRecommendations(
    userId: string,
    products: Product[]
  ): Promise<Product[]> {
    try {
      // For now, use random user preferences simulation
      // In real implementation, this would be based on user history
      const userProfile = this.generateMockUserProfile()

      // Generate embedding for user profile
      const userText = `${userProfile.interests.join(' ')} ${userProfile.preferredCategories.join(' ')}`
      const userEmbedding = await this.model!.embed([userText])
      const userVector = tf.slice(userEmbedding, [0, 0], [1, -1])

      // Calculate similarities
      const similarities: Array<{ product: Product; similarity: number }> = []

      for (const product of products) {
        const productEmbedding = this.embeddings.get(product.id)
        if (productEmbedding) {
          const similarity = tf.metrics.cosineProximity(userVector, productEmbedding)
          const similarityValue = (await similarity.data())[0]
          similarities.push({
            product,
            similarity: Math.abs(similarityValue) // cosine proximity returns negative values
          })
        }
      }

      // Sort by similarity and return top recommendations
      similarities.sort((a, b) => b.similarity - a.similarity)

      // Clean up tensors
      userVector.dispose()
      userEmbedding.dispose()

      return similarities.slice(0, 6).map(item => item.product)
    } catch (error) {
      console.error('❌ Semantic recommendation failed:', error)
      return products.slice(0, 6)
    }
  }

  private getPopularityBasedRecommendations(products: Product[]): Product[] {
    // Simple popularity scoring based on discount percentage and quantity
    const scored = products.map(product => ({
      product,
      score: (product.discountPercentage * 0.6) + (product.quantity > 10 ? 0.4 : 0.2)
    }))

    scored.sort((a, b) => b.score - a.score)
    return scored.slice(0, 6).map(item => item.product)
  }

  private generateMockUserProfile() {
    // Mock user profile - in real app this would come from user data
    return {
      interests: ['здоровое питание', 'экономия', 'экологичность', 'качественная одежда'],
      preferredCategories: ['food', 'fashion'],
      preferredPriceRange: { min: 500, max: 10000 },
      location: 'Астана',
    }
  }

  private calculateDistance(
    point1: { lat: number; lng: number },
    point2: { lat: number; lng: number }
  ): number {
    const R = 6371 // Earth's radius in km
    const dLat = (point2.lat - point1.lat) * Math.PI / 180
    const dLng = (point2.lng - point1.lng) * Math.PI / 180
    const a =
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(point1.lat * Math.PI / 180) * Math.cos(point2.lat * Math.PI / 180) *
      Math.sin(dLng/2) * Math.sin(dLng/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  async predictDemand(product: Product, location: { lat: number; lng: number }): Promise<number> {
    // Mock demand prediction based on product type and location
    const baseDemand = product.category === 'food' ? 0.8 : 0.6
    const locationMultiplier = this.getLocationDemandMultiplier(location)
    const timeMultiplier = this.getTimeDemandMultiplier()

    return Math.min(baseDemand * locationMultiplier * timeMultiplier, 1.0)
  }

  private getLocationDemandMultiplier(location: { lat: number; lng: number }): number {
    // Higher demand in major cities
    const majorCities = [
      { lat: 51.1694, lng: 71.4491, multiplier: 1.2 }, // Astana
      { lat: 43.2567, lng: 76.9286, multiplier: 1.3 }, // Almaty
    ]

    for (const city of majorCities) {
      const distance = this.calculateDistance(location, city)
      if (distance < 50) { // Within 50km
        return city.multiplier
      }
    }

    return 1.0
  }

  private getTimeDemandMultiplier(): number {
    const hour = new Date().getHours()

    // Higher demand during typical shopping hours
    if (hour >= 11 && hour <= 14) return 1.3 // Lunch time
    if (hour >= 17 && hour <= 20) return 1.2 // Evening
    if (hour >= 8 && hour <= 10) return 1.1 // Morning

    return 0.8 // Off-peak hours
  }

  async optimizePrice(product: Product, marketData: any): Promise<number> {
    // Simple price optimization based on demand and competition
    const basePrice = product.originalPrice
    const demandScore = await this.predictDemand(product, product.location)
    const competitionFactor = marketData?.competition || 1.0

    // Adjust price based on demand and competition
    let optimizedPrice = basePrice * (2 - demandScore) // Higher demand = higher price
    optimizedPrice = optimizedPrice / competitionFactor // More competition = lower price

    // Ensure minimum discount
    const minDiscountPrice = basePrice * 0.3 // At least 70% discount
    const maxDiscountPrice = basePrice * 0.8 // Maximum 20% discount

    return Math.max(minDiscountPrice, Math.min(maxDiscountPrice, optimizedPrice))
  }

  dispose() {
    // Clean up tensors
    this.embeddings.forEach(embedding => embedding.dispose())
    this.embeddings.clear()
    this.isInitialized = false
  }
}

// Singleton instance
export const aiService = new AIService()
