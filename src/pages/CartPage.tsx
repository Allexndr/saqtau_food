import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  Button,
  TextField,
  InputAdornment,
  Divider,
  Alert,
  IconButton,
  useTheme,
  useMediaQuery,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@mui/material'
import {
  ShoppingCart,
  DeleteSweep,
  LocalOffer,
  ArrowForward,
  ShoppingBag,
  Calculate,
  Info,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import CartItem from '../components/CartItem'
import { useCart } from '../hooks/useCart'

const CartPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()
  const navigate = useNavigate()

  const {
    cart,
    updateQuantity,
    removeFromCart,
    clearCart,
    applyPromoCode,
    removePromoCode,
  } = useCart()

  const [promoCode, setPromoCode] = useState('')
  const [promoError, setPromoError] = useState('')
  const [clearDialogOpen, setClearDialogOpen] = useState(false)

  const handleApplyPromoCode = () => {
    if (!promoCode.trim()) {
      setPromoError('Введите промокод')
      return
    }

    // Simple promo code validation (in real app, this would be server-side)
    const validCodes = ['SAVE10', 'FOOD15', 'ECO20']
    if (validCodes.includes(promoCode.toUpperCase())) {
      applyPromoCode(promoCode.toUpperCase())
      setPromoCode('')
      setPromoError('')
    } else {
      setPromoError('Недействительный промокод')
    }
  }

  const handleClearCart = () => {
    clearCart()
    setClearDialogOpen(false)
  }

  const handleCheckout = () => {
    if (!cart || cart.items.length === 0) return
    navigate('/checkout')
  }

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Box
            sx={{
              textAlign: 'center',
              py: 8,
              bgcolor: 'grey.50',
              borderRadius: 4,
              border: `2px dashed ${theme.palette.divider}`,
            }}
          >
            <ShoppingCart
              sx={{
                fontSize: 80,
                color: theme.palette.text.disabled,
                mb: 3,
              }}
            />
            <Typography variant="h5" sx={{ mb: 2, fontWeight: 600 }}>
              {t('cart.empty')}
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              {t('cart.addItems')}
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/offers')}
              startIcon={<ShoppingBag />}
              sx={{
                px: 4,
                py: 1.5,
                borderRadius: 25,
                fontSize: '1.1rem',
                fontWeight: 600,
              }}
            >
              Перейти к покупкам
            </Button>
          </Box>
        </motion.div>
      </Container>
    )
  }

  return (
    <Container maxWidth="lg" sx={{ py: 3 }}>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {/* Header */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
          <Box>
            <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
              {t('cart.title')}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {cart.items.length} товаров в корзине
            </Typography>
          </Box>

          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteSweep />}
            onClick={() => setClearDialogOpen(true)}
            sx={{ borderRadius: 2 }}
          >
            Очистить корзину
          </Button>
        </Box>

        <Grid container spacing={4}>
          {/* Cart Items */}
          <Grid item xs={12} lg={8}>
            <AnimatePresence>
              {cart.items.map((item) => (
                <CartItem
                  key={item.productId}
                  item={item}
                  onUpdateQuantity={updateQuantity}
                  onRemove={removeFromCart}
                />
              ))}
            </AnimatePresence>
          </Grid>

          {/* Order Summary */}
          <Grid item xs={12} lg={4}>
            <Card
              sx={{
                position: 'sticky',
                top: 20,
                borderRadius: 3,
                border: `1px solid ${theme.palette.divider}`,
              }}
            >
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ fontWeight: 700, mb: 3 }}>
                  Сумма заказа
                </Typography>

                {/* Items breakdown */}
                <Box sx={{ mb: 3 }}>
                  {cart.items.map((item) => (
                    <Box
                      key={item.productId}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        mb: 1,
                      }}
                    >
                      <Typography variant="body2" sx={{ flexGrow: 1, mr: 2 }}>
                        {item.product.title}
                        <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
                          ×{item.quantity}
                        </Typography>
                      </Typography>
                      <Typography variant="body2" sx={{ fontWeight: 600 }}>
                        {(item.product.discountPrice * item.quantity).toLocaleString()} ₸
                      </Typography>
                    </Box>
                  ))}
                </Box>

                <Divider sx={{ my: 2 }} />

                {/* Totals */}
                <Box sx={{ mb: 3 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">{t('cart.total')}</Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {cart.total.toLocaleString()} ₸
                    </Typography>
                  </Box>

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2" color="success.main">
                      {t('cart.commission')}
                    </Typography>
                    <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                      +{cart.commission.toLocaleString()} ₸
                    </Typography>
                  </Box>

                  {cart.discount > 0 && (
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                      <Typography variant="body2" color="success.main">
                        {t('cart.discount')}
                      </Typography>
                      <Typography variant="body2" color="success.main" sx={{ fontWeight: 600 }}>
                        -{cart.discount.toLocaleString()} ₸
                      </Typography>
                    </Box>
                  )}

                  <Divider sx={{ my: 1 }} />

                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      {t('cart.finalTotal')}
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {cart.finalTotal.toLocaleString()} ₸
                    </Typography>
                  </Box>
                </Box>

                {/* Promo Code */}
                <Box sx={{ mb: 3 }}>
                  <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                    {t('cart.promoCode')}
                  </Typography>

                  {cart.promoCode ? (
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                      <LocalOffer sx={{ color: theme.palette.success.main }} />
                      <Typography variant="body2" sx={{ flexGrow: 1 }}>
                        Промокод: <strong>{cart.promoCode}</strong>
                      </Typography>
                      <IconButton
                        size="small"
                        onClick={removePromoCode}
                        sx={{ color: theme.palette.error.main }}
                      >
                        ✕
                      </IconButton>
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      <TextField
                        fullWidth
                        size="small"
                        placeholder="Введите промокод"
                        value={promoCode}
                        onChange={(e) => {
                          setPromoCode(e.target.value)
                          setPromoError('')
                        }}
                        error={!!promoError}
                        helperText={promoError}
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: 2,
                          },
                        }}
                      />
                      <Button
                        variant="outlined"
                        onClick={handleApplyPromoCode}
                        sx={{ borderRadius: 2, px: 3 }}
                      >
                        {t('cart.apply')}
                      </Button>
                    </Box>
                  )}
                </Box>

                {/* Available Promo Codes Hint */}
                {!cart.promoCode && (
                  <Alert
                    severity="info"
                    sx={{
                      mb: 3,
                      borderRadius: 2,
                      '& .MuiAlert-icon': { color: theme.palette.info.main }
                    }}
                    icon={<Info />}
                  >
                    <Typography variant="body2">
                      <strong>Доступные промокоды:</strong> SAVE10, FOOD15, ECO20
                    </Typography>
                  </Alert>
                )}

                {/* Checkout Button */}
                <Button
                  fullWidth
                  variant="contained"
                  size="large"
                  onClick={handleCheckout}
                  endIcon={<ArrowForward />}
                  sx={{
                    py: 1.5,
                    borderRadius: 25,
                    fontSize: '1.1rem',
                    fontWeight: 700,
                    background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                    boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                    '&:hover': {
                      background: `linear-gradient(135deg, ${theme.palette.primary.dark} 0%, ${theme.palette.secondary.dark} 100%)`,
                      transform: 'translateY(-2px)',
                      boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                    },
                    transition: 'all 0.3s ease',
                  }}
                >
                  {t('cart.checkout')}
                </Button>

                {/* Commission Info */}
                <Alert
                  severity="info"
                  sx={{
                    mt: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(33, 150, 243, 0.05)',
                    border: `1px solid ${theme.palette.info.main}20`,
                  }}
                  icon={<Calculate />}
                >
                  <Typography variant="caption">
                    Комиссия 15% идет на развитие платформы и поддержку устойчивого развития
                  </Typography>
                </Alert>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Clear Cart Dialog */}
        <Dialog
          open={clearDialogOpen}
          onClose={() => setClearDialogOpen(false)}
          maxWidth="sm"
          fullWidth
        >
          <DialogTitle>Очистить корзину?</DialogTitle>
          <DialogContent>
            <Typography>
              Вы действительно хотите удалить все товары из корзины? Это действие нельзя отменить.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setClearDialogOpen(false)}>Отмена</Button>
            <Button onClick={handleClearCart} color="error" variant="contained">
              Очистить
            </Button>
          </DialogActions>
        </Dialog>
      </motion.div>
    </Container>
  )
}

export default CartPage
