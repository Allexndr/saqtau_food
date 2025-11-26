import { useState, useEffect, useMemo } from 'react'
import { useSearchParams } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Grid,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Button,
  Card,
  CardContent,
  ToggleButton,
  ToggleButtonGroup,
  Slider,
  useTheme,
  useMediaQuery,
  Drawer,
  IconButton,
  Badge,
  Alert,
} from '@mui/material'
import {
  Search,
  FilterList,
  Sort,
  LocationOn,
  Close,
  SmartToy,
  TrendingUp,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import ProductCard from '../components/ProductCard'
import { mockProducts } from '../utils/mockData'
import { Product } from '../types'
import { aiService } from '../services/aiService'

const OffersPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()
  const [searchParams, setSearchParams] = useSearchParams()

  // State
  const [products, setProducts] = useState<Product[]>(mockProducts)
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(mockProducts)
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string>(
    searchParams.get('category') || 'all'
  )
  const [sortBy, setSortBy] = useState<'discount' | 'price' | 'distance' | 'newest'>('discount')
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 50000])
  const [maxDistance, setMaxDistance] = useState<number>(50)
  const [showFilters, setShowFilters] = useState(!isMobile)
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [isLoadingAI, setIsLoadingAI] = useState(false)

  // Initialize AI service
  useEffect(() => {
    const initAI = async () => {
      try {
        await aiService.initialize()
        await aiService.generateEmbeddings(mockProducts)
        console.log('🤖 AI service ready for recommendations')
      } catch (error) {
        console.error('Failed to initialize AI:', error)
      }
    }
    initAI()
  }, [])

  // Get user location
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        (error) => {
          console.log('Location access denied:', error)
          // Default to Astana center
          setUserLocation({ lat: 51.1694, lng: 71.4491 })
        }
      )
    }
  }, [])

  // Filter and sort products
  const processedProducts = useMemo(() => {
    let filtered = products.filter(product => {
      // Category filter
      if (selectedCategory !== 'all' && product.category !== selectedCategory) {
        return false
      }

      // Search filter
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const matches =
          product.title.toLowerCase().includes(query) ||
          product.description.toLowerCase().includes(query) ||
          product.tags.some(tag => tag.toLowerCase().includes(query)) ||
          product.partnerName.toLowerCase().includes(query)
        if (!matches) return false
      }

      // Price range filter
      if (product.discountPrice < priceRange[0] || product.discountPrice > priceRange[1]) {
        return false
      }

      // Distance filter
      if (userLocation && maxDistance < 1000) {
        const distance = calculateDistance(userLocation, product.location)
        if (distance > maxDistance) return false
      }

      return true
    })

    // Sort products
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'discount':
          return b.discountPercentage - a.discountPercentage
        case 'price':
          return a.discountPrice - b.discountPrice
        case 'distance':
          if (!userLocation) return 0
          return calculateDistance(userLocation, a.location) - calculateDistance(userLocation, b.location)
        case 'newest':
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        default:
          return 0
      }
    })

    return filtered
  }, [products, selectedCategory, searchQuery, priceRange, maxDistance, sortBy, userLocation])

  // Get AI recommendations
  const getAIRecommendations = async () => {
    if (!userLocation) return

    setIsLoadingAI(true)
    try {
      const aiRecs = await aiService.getRecommendations('guest', products, {
        favoriteCategories: selectedCategory !== 'all' ? [selectedCategory] : ['food', 'fashion'],
        location: userLocation,
        maxDistance: maxDistance,
      })
      setRecommendations(aiRecs)
    } catch (error) {
      console.error('AI recommendations failed:', error)
    } finally {
      setIsLoadingAI(false)
    }
  }

  useEffect(() => {
    setFilteredProducts(processedProducts)
  }, [processedProducts])

  const calculateDistance = (point1: { lat: number; lng: number }, point2: { lat: number; lng: number }) => {
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

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category)
    setSearchParams(category !== 'all' ? { category } : {})
  }

  const clearFilters = () => {
    setSearchQuery('')
    setSelectedCategory('all')
    setPriceRange([0, 50000])
    setMaxDistance(50)
    setSortBy('discount')
    setSearchParams({})
  }

  const filtersContent = (
    <Box sx={{ p: 2 }}>
      <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
        Фильтры
      </Typography>

      {/* Search */}
      <TextField
        fullWidth
        placeholder="Поиск товаров..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 3 }}
      />

      {/* Categories */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Категории
        </Typography>
        <ToggleButtonGroup
          value={selectedCategory}
          exclusive
          onChange={(_, value) => value && handleCategoryChange(value)}
          sx={{ width: '100%', flexWrap: 'wrap' }}
        >
          <ToggleButton value="all" sx={{ flex: 1, minWidth: 'auto' }}>
            Все
          </ToggleButton>
          <ToggleButton value="food" sx={{ flex: 1, minWidth: 'auto' }}>
            🍎 Еда
          </ToggleButton>
          <ToggleButton value="fashion" sx={{ flex: 1, minWidth: 'auto' }}>
            👕 Одежда
          </ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {/* Price Range */}
      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
          Цена: {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()} ₸
        </Typography>
        <Slider
          value={priceRange}
          onChange={(_, newValue) => setPriceRange(newValue as [number, number])}
          valueLabelDisplay="auto"
          min={0}
          max={50000}
          step={1000}
        />
      </Box>

      {/* Distance */}
      {userLocation && (
        <Box sx={{ mb: 3 }}>
          <Typography variant="subtitle2" sx={{ mb: 2, fontWeight: 600 }}>
            Расстояние: до {maxDistance} км
          </Typography>
          <Slider
            value={maxDistance}
            onChange={(_, newValue) => setMaxDistance(newValue as number)}
            valueLabelDisplay="auto"
            min={1}
            max={100}
            step={5}
          />
        </Box>
      )}

      {/* Sort */}
      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Сортировка</InputLabel>
          <Select
            value={sortBy}
            label="Сортировка"
            onChange={(e) => setSortBy(e.target.value as any)}
          >
            <MenuItem value="discount">По скидке</MenuItem>
            <MenuItem value="price">По цене</MenuItem>
            <MenuItem value="distance">По расстоянию</MenuItem>
            <MenuItem value="newest">Сначала новые</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {/* AI Recommendations */}
      <Button
        fullWidth
        variant="outlined"
        startIcon={<SmartToy />}
        onClick={getAIRecommendations}
        disabled={isLoadingAI || !userLocation}
        sx={{ mb: 2 }}
      >
        {isLoadingAI ? '🤖 Анализ...' : '🎯 AI рекомендации'}
      </Button>

      {/* Clear Filters */}
      <Button
        fullWidth
        variant="text"
        onClick={clearFilters}
        sx={{ color: theme.palette.text.secondary }}
      >
        Сбросить фильтры
      </Button>
    </Box>
  )

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Box sx={{ display: 'flex', gap: 3 }}>
        {/* Filters Sidebar */}
        {isMobile ? (
          <Drawer
            anchor="left"
            open={showFilters}
            onClose={() => setShowFilters(false)}
            sx={{
              '& .MuiDrawer-paper': {
                width: 300,
                bgcolor: 'background.paper',
              },
            }}
          >
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', p: 2 }}>
              <Typography variant="h6">Фильтры</Typography>
              <IconButton onClick={() => setShowFilters(false)}>
                <Close />
              </IconButton>
            </Box>
            {filtersContent}
          </Drawer>
        ) : (
          showFilters && (
            <Box sx={{ width: 300, flexShrink: 0 }}>
              <Card sx={{ position: 'sticky', top: 20 }}>
                {filtersContent}
              </Card>
            </Box>
          )
        )}

        {/* Main Content */}
        <Box sx={{ flexGrow: 1 }}>
          {/* Header */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Box>
              <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
                Предложения
              </Typography>
              <Typography variant="body1" color="text.secondary">
                {filteredProducts.length} товаров найдено
              </Typography>
            </Box>

            {isMobile && (
              <Button
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => setShowFilters(true)}
              >
                Фильтры
              </Button>
            )}
          </Box>

          {/* AI Recommendations Banner */}
          <AnimatePresence>
            {recommendations.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
              >
                <Alert
                  severity="info"
                  sx={{ mb: 3, borderRadius: 2 }}
                  icon={<SmartToy />}
                  action={
                    <IconButton
                      size="small"
                      onClick={() => setRecommendations([])}
                    >
                      <Close fontSize="small" />
                    </IconButton>
                  }
                >
                  <Typography variant="body2" sx={{ fontWeight: 600 }}>
                    🎯 Персональные AI рекомендации готовы!
                  </Typography>
                </Alert>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Products Grid */}
          <AnimatePresence mode="wait">
            <motion.div
              key={filteredProducts.length + (recommendations.length > 0 ? 'ai' : '')}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Grid container spacing={3}>
                {/* Show AI recommendations first if available */}
                {recommendations.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={`rec-${product.id}`}>
                    <Box sx={{ position: 'relative' }}>
                      <Chip
                        label="🎯 AI рекомендация"
                        size="small"
                        sx={{
                          position: 'absolute',
                          top: -8,
                          left: 16,
                          zIndex: 1,
                          bgcolor: theme.palette.primary.main,
                          color: 'white',
                          fontWeight: 600,
                        }}
                      />
                      <ProductCard product={product} />
                    </Box>
                  </Grid>
                ))}

                {/* Regular products */}
                {filteredProducts.map((product) => (
                  <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
                    <ProductCard product={product} />
                  </Grid>
                ))}
              </Grid>
            </motion.div>
          </AnimatePresence>

          {/* Empty State */}
          {filteredProducts.length === 0 && (
            <Box
              sx={{
                textAlign: 'center',
                py: 8,
                bgcolor: 'grey.50',
                borderRadius: 3,
              }}
            >
              <Typography variant="h6" color="text.secondary" sx={{ mb: 2 }}>
                😔 Ничего не найдено
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Попробуйте изменить фильтры или поисковый запрос
              </Typography>
              <Button variant="outlined" onClick={clearFilters}>
                Сбросить фильтры
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Container>
  )
}

export default OffersPage
