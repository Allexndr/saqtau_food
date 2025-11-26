import {
  Card,
  CardContent,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Chip,
  useTheme,
} from '@mui/material'
import {
  Delete,
  Add,
  Remove,
  LocationOn,
  AccessTime,
  LocalOffer,
} from '@mui/icons-material'
import { CartItem as CartItemType } from '../types'
import { motion } from 'framer-motion'

interface CartItemProps {
  item: CartItemType
  onUpdateQuantity: (productId: string, quantity: number) => void
  onRemove: (productId: string) => void
}

const CartItem = ({ item, onUpdateQuantity, onRemove }: CartItemProps) => {
  const theme = useTheme()
  const { product, quantity } = item

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity <= 0) {
      onRemove(product.id)
      return
    }
    if (newQuantity <= product.quantity) {
      onUpdateQuantity(product.id, newQuantity)
    }
  }

  const totalPrice = product.discountPrice * quantity
  const isFood = product.category === 'food'

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.3 }}
    >
      <Card
        sx={{
          mb: 2,
          borderRadius: 3,
          border: `1px solid ${theme.palette.divider}`,
          overflow: 'visible',
          position: 'relative',
        }}
      >
        {/* Discount Badge */}
        <Box
          sx={{
            position: 'absolute',
            top: -8,
            left: 16,
            zIndex: 1,
            bgcolor: isFood ? theme.palette.success.main : theme.palette.primary.main,
            color: 'white',
            px: 1,
            py: 0.5,
            borderRadius: 2,
            fontSize: '0.75rem',
            fontWeight: 700,
          }}
        >
          -{product.discountPercentage}%
        </Box>

        <CardContent sx={{ p: 3 }}>
          <Box sx={{ display: 'flex', gap: 3 }}>
            {/* Product Image */}
            <Box
              sx={{
                width: 120,
                height: 120,
                borderRadius: 2,
                overflow: 'hidden',
                flexShrink: 0,
                bgcolor: 'grey.100',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              {product.images[0] ? (
                <img
                  src={product.images[0]}
                  alt={product.title}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              ) : (
                <Typography variant="h4">
                  {isFood ? '🍎' : '👕'}
                </Typography>
              )}
            </Box>

            {/* Product Details */}
            <Box sx={{ flexGrow: 1, minWidth: 0 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box sx={{ minWidth: 0, flexGrow: 1 }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 600,
                      mb: 0.5,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {product.partnerName}
                  </Typography>
                </Box>

                <IconButton
                  onClick={() => onRemove(product.id)}
                  sx={{
                    color: theme.palette.error.main,
                    '&:hover': {
                      bgcolor: theme.palette.error.main + '10',
                    },
                  }}
                >
                  <Delete />
                </IconButton>
              </Box>

              {/* Category and Tags */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
                <Chip
                  label={isFood ? '🍎 Еда' : '👕 Одежда'}
                  size="small"
                  sx={{
                    bgcolor: isFood
                      ? 'rgba(76, 175, 80, 0.1)'
                      : 'rgba(33, 150, 243, 0.1)',
                    color: isFood ? theme.palette.success.main : theme.palette.primary.main,
                    fontSize: '0.75rem',
                  }}
                />
                {product.tags.slice(0, 2).map((tag) => (
                  <Chip
                    key={tag}
                    label={tag}
                    size="small"
                    variant="outlined"
                    sx={{ fontSize: '0.7rem', height: 24 }}
                  />
                ))}
              </Box>

              {/* Location and Time */}
              <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 2 }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <LocationOn sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {product.location.address.split(',')[0]}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <AccessTime sx={{ fontSize: 16, color: 'text.secondary' }} />
                  <Typography variant="caption" color="text.secondary">
                    {product.pickupTimeStart} - {product.pickupTimeEnd}
                  </Typography>
                </Box>
              </Box>

              {/* Quantity and Price Controls */}
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity - 1)}
                    disabled={quantity <= 1}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Remove fontSize="small" />
                  </IconButton>

                  <TextField
                    type="number"
                    value={quantity}
                    onChange={(e) => {
                      const value = parseInt(e.target.value) || 1
                      handleQuantityChange(value)
                    }}
                    inputProps={{
                      min: 1,
                      max: product.quantity,
                      style: { textAlign: 'center', width: '60px' }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1,
                        '& fieldset': {
                          borderColor: theme.palette.divider,
                        },
                      },
                      '& input': {
                        textAlign: 'center',
                        fontWeight: 600,
                      },
                    }}
                  />

                  <IconButton
                    size="small"
                    onClick={() => handleQuantityChange(quantity + 1)}
                    disabled={quantity >= product.quantity}
                    sx={{
                      border: `1px solid ${theme.palette.divider}`,
                      borderRadius: 1,
                    }}
                  >
                    <Add fontSize="small" />
                  </IconButton>

                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    из {product.quantity} {product.unit}
                  </Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                  <Typography
                    variant="h6"
                    sx={{
                      fontWeight: 700,
                      color: isFood ? theme.palette.success.main : theme.palette.primary.main,
                    }}
                  >
                    {totalPrice.toLocaleString()} ₸
                  </Typography>
                  <Typography
                    variant="caption"
                    sx={{
                      textDecoration: 'line-through',
                      color: 'text.secondary',
                    }}
                  >
                    {(product.originalPrice * quantity).toLocaleString()} ₸
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </motion.div>
  )
}

export default CartItem
