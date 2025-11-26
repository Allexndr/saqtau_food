import { useState, useEffect, createContext, useContext, ReactNode } from 'react'
import { Cart, CartItem, Product } from '../types'

interface CartContextType {
  cart: Cart | null
  addToCart: (product: Product, quantity?: number) => void
  removeFromCart: (productId: string) => void
  updateQuantity: (productId: string, quantity: number) => void
  clearCart: () => void
  applyPromoCode: (code: string) => void
  removePromoCode: () => void
  getTotalItems: () => number
  getTotalPrice: () => number
}

const CartContext = createContext<CartContextType | undefined>(undefined)

export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error('useCart must be used within a CartProvider')
  }
  return context
}

interface CartProviderProps {
  children: ReactNode
}

export const CartProvider = ({ children }: CartProviderProps) => {
  const [cart, setCart] = useState<Cart | null>(null)

  // Load cart from localStorage on mount
  useEffect(() => {
    const savedCart = localStorage.getItem('saqtau_cart')
    if (savedCart) {
      try {
        const parsedCart = JSON.parse(savedCart)
        // Convert date strings back to Date objects
        if (parsedCart.createdAt) {
          parsedCart.createdAt = new Date(parsedCart.createdAt)
        }
        if (parsedCart.updatedAt) {
          parsedCart.updatedAt = new Date(parsedCart.updatedAt)
        }
        parsedCart.items = parsedCart.items.map((item: any) => ({
          ...item,
          addedAt: new Date(item.addedAt)
        }))
        setCart(parsedCart)
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Save cart to localStorage whenever it changes
  useEffect(() => {
    if (cart) {
      localStorage.setItem('saqtau_cart', JSON.stringify(cart))
    } else {
      localStorage.removeItem('saqtau_cart')
    }
  }, [cart])

  const createNewCart = (): Cart => {
    const now = new Date()
    return {
      id: `cart_${Date.now()}`,
      userId: 'guest', // Will be updated when user logs in
      items: [],
      total: 0,
      discount: 0,
      commission: 0,
      finalTotal: 0,
      createdAt: now,
      updatedAt: now,
    }
  }

  const calculateTotals = (items: CartItem[]): { total: number; commission: number; finalTotal: number } => {
    const total = items.reduce((sum, item) => sum + (item.product.discountPrice * item.quantity), 0)
    const commission = total * 0.15 // 15% platform commission
    const discount = cart?.promoCode ? total * 0.1 : 0 // Example: 10% discount for promo codes
    const finalTotal = total + commission - discount

    return { total, commission, finalTotal }
  }

  const addToCart = (product: Product, quantity: number = 1) => {
    setCart(prevCart => {
      const currentCart = prevCart || createNewCart()
      const existingItemIndex = currentCart.items.findIndex(item => item.productId === product.id)

      if (existingItemIndex >= 0) {
        // Update existing item quantity
        currentCart.items[existingItemIndex].quantity += quantity
      } else {
        // Add new item
        const newItem: CartItem = {
          productId: product.id,
          product,
          quantity,
          addedAt: new Date(),
        }
        currentCart.items.push(newItem)
      }

      // Recalculate totals
      const { total, commission, finalTotal } = calculateTotals(currentCart.items)
      currentCart.total = total
      currentCart.commission = commission
      currentCart.finalTotal = finalTotal
      currentCart.updatedAt = new Date()

      return { ...currentCart }
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => {
      if (!prevCart) return null

      const updatedItems = prevCart.items.filter(item => item.productId !== productId)

      if (updatedItems.length === 0) {
        return null // Clear cart if empty
      }

      const { total, commission, finalTotal } = calculateTotals(updatedItems)

      return {
        ...prevCart,
        items: updatedItems,
        total,
        commission,
        finalTotal,
        updatedAt: new Date(),
      }
    })
  }

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId)
      return
    }

    setCart(prevCart => {
      if (!prevCart) return null

      const updatedItems = prevCart.items.map(item =>
        item.productId === productId ? { ...item, quantity } : item
      )

      const { total, commission, finalTotal } = calculateTotals(updatedItems)

      return {
        ...prevCart,
        items: updatedItems,
        total,
        commission,
        finalTotal,
        updatedAt: new Date(),
      }
    })
  }

  const clearCart = () => {
    setCart(null)
  }

  const applyPromoCode = (code: string) => {
    setCart(prevCart => {
      if (!prevCart) return null

      const { total, commission, finalTotal } = calculateTotals(prevCart.items)

      return {
        ...prevCart,
        promoCode: code,
        discount: total * 0.1, // 10% discount
        finalTotal: total + commission - (total * 0.1),
        updatedAt: new Date(),
      }
    })
  }

  const removePromoCode = () => {
    setCart(prevCart => {
      if (!prevCart) return null

      const { total, commission, finalTotal } = calculateTotals(prevCart.items)

      return {
        ...prevCart,
        promoCode: undefined,
        discount: 0,
        finalTotal,
        updatedAt: new Date(),
      }
    })
  }

  const getTotalItems = (): number => {
    return cart?.items?.reduce((sum, item) => sum + item.quantity, 0) || 0
  }

  const getTotalPrice = (): number => {
    return cart?.finalTotal || 0
  }

  const value: CartContextType = {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    applyPromoCode,
    removePromoCode,
    getTotalItems,
    getTotalPrice,
  }

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  )
}
