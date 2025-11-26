import { useState } from 'react'
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Chip,
  Box,
  IconButton,
  Tooltip,
  useTheme,
  Skeleton,
} from '@mui/material'
import {
  Favorite,
  FavoriteBorder,
  ShoppingCart,
  LocationOn,
  AccessTime,
  LocalOffer,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { Product } from '../types'
import { useCart } from '../hooks/useCart'
import { motion } from 'framer-motion'

interface ProductCardProps {
  product: Product
  onViewDetails?: (product: Product) => void
}

const ProductCard = ({ product, onViewDetails }: ProductCardProps) => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { addToCart } = useCart()
  const [isFavorite, setIsFavorite] = useState(false)
  const [imageLoaded, setImageLoaded] = useState(false)

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation()
    addToCart(product)
  }

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation()
    setIsFavorite(!isFavorite)
  }

  const discountPercentage = Math.round(
    ((product.originalPrice - product.discountPrice) / product.originalPrice) * 100
  )

  const isFood = product.category === 'food'
  const cardColor = isFood
    ? theme.palette.success.main
    : theme.palette.primary.main

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Card
        sx={{
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          cursor: 'pointer',
          borderRadius: 3,
          overflow: 'hidden',
          border: `1px solid ${theme.palette.divider}`,
          position: 'relative',
          '&:hover': {
            boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
          },
        }}
        onClick={() => onViewDetails?.(product)}
      >
        {/* Discount Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: 12,
            left: 12,
            zIndex: 2,
            bgcolor: cardColor,
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          -{discountPercentage}%
        </Box>

        {/* Favorite Button */}
        <IconButton
          onClick={handleToggleFavorite}
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 2,
            bgcolor: 'rgba(255, 255, 255, 0.9)',
            '&:hover': {
              bgcolor: 'rgba(255, 255, 255, 1)',
            },
          }}
        >
          {isFavorite ? (
            <Favorite sx={{ color: theme.palette.error.main }} />
          ) : (
            <FavoriteBorder />
          )}
        </IconButton>

        {/* Product Image */}
        <Box sx={{ position: 'relative', pt: '56.25%' }}>
          {!imageLoaded && (
            <Skeleton
              variant="rectangular"
              sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
              }}
            />
          )}
          <CardMedia
            component="img"
            image={product.images[0]}
            alt={product.title}
            onLoad={() => setImageLoaded(true)}
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              display: imageLoaded ? 'block' : 'none',
            }}
          />
        </Box>

        <CardContent sx={{ flexGrow: 1, p: 2 }}>
          {/* Category Badge */}
          <Box sx={{ mb: 1 }}>
            <Chip
              label={isFood ? '🍎 Еда' : '👕 Одежда'}
              size="small"
              sx={{
                bgcolor: isFood
                  ? 'rgba(76, 175, 80, 0.1)'
                  : 'rgba(33, 150, 243, 0.1)',
                color: cardColor,
                fontWeight: 600,
                fontSize: '0.75rem',
              }}
            />
          </Box>

          {/* Title */}
          <Typography
            variant="h6"
            component="h2"
            sx={{
              mb: 1,
              fontWeight: 600,
              fontSize: '1rem',
              lineHeight: 1.3,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
            }}
          >
            {product.title}
          </Typography>

          {/* Description */}
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              mb: 2,
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              lineHeight: 1.4,
            }}
          >
            {product.description}
          </Typography>

          {/* Location and Time */}
          <Box sx={{ mb: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 0.5 }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {product.location.address.split(',')[0]}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <AccessTime sx={{ fontSize: 16, mr: 0.5, color: 'text.secondary' }} />
              <Typography variant="caption" color="text.secondary">
                {product.pickupTimeStart} - {product.pickupTimeEnd}
              </Typography>
            </Box>
          </Box>

          {/* Partner */}
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mb: 1, display: 'block' }}
          >
            {product.partnerName}
          </Typography>

          {/* Price */}
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
            <Typography
              variant="h6"
              sx={{
                fontWeight: 700,
                color: cardColor,
                mr: 1,
              }}
            >
              {product.discountPrice.toLocaleString()} ₸
            </Typography>
            <Typography
              variant="body2"
              sx={{
                textDecoration: 'line-through',
                color: 'text.secondary',
              }}
            >
              {product.originalPrice.toLocaleString()} ₸
            </Typography>
          </Box>

          {/* Quantity */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="body2" color="text.secondary">
              Осталось: {product.quantity} {product.unit}
            </Typography>
          </Box>

          {/* Tags */}
          {product.tags && product.tags.length > 0 && (
            <Box sx={{ mb: 2, display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
              {product.tags.slice(0, 3).map((tag) => (
                <Chip
                  key={tag}
                  label={tag}
                  size="small"
                  variant="outlined"
                  sx={{
                    fontSize: '0.7rem',
                    height: 24,
                  }}
                />
              ))}
            </Box>
          )}

          {/* Add to Cart Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleAddToCart}
            startIcon={<ShoppingCart />}
            sx={{
              borderRadius: 2,
              py: 1,
              fontWeight: 600,
              bgcolor: cardColor,
              '&:hover': {
                bgcolor: isFood
                  ? theme.palette.success.dark
                  : theme.palette.primary.dark,
              },
            }}
          >
            Добавить в корзину
          </Button>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default ProductCard
