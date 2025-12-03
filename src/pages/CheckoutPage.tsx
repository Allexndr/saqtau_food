import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Card,
  CardContent,
  Grid,
  TextField,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  FormControl,
  FormLabel,
  Divider,
  Alert,
  useTheme,
  useMediaQuery,
} from '@mui/material'
import {
  Person,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  CreditCard,
  Money,
  Phone,
  Email,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion, AnimatePresence } from 'framer-motion'
import { useCart } from '../hooks/useCart'
import type { Order } from '../types'

const steps = ['Контакты', 'Оплата', 'Подтверждение']

const CheckoutPage = () => {
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()
  const navigate = useNavigate()
  const { cart, clearCart } = useCart()

  const [activeStep, setActiveStep] = useState(0)
  const [orderData, setOrderData] = useState({
    // Contact info
    firstName: '',
    lastName: '',
    phone: '',
    email: '',
    notes: '',

    // Payment info
    paymentMethod: 'kaspi' as 'kaspi' | 'halyk' | 'card' | 'cash',
    savePaymentInfo: false,

    // Confirmation
    termsAccepted: false,
    marketingConsent: false,
  })

  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isProcessing, setIsProcessing] = useState(false)

  if (!cart || cart.items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="warning" sx={{ borderRadius: 2 }}>
          Ваша корзина пуста. Добавьте товары перед оформлением заказа.
        </Alert>
      </Container>
    )
  }

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {}

    if (step === 0) {
      if (!orderData.firstName.trim()) newErrors.firstName = 'Имя обязательно'
      if (!orderData.lastName.trim()) newErrors.lastName = 'Фамилия обязательна'
      if (!orderData.phone.trim()) newErrors.phone = 'Телефон обязателен'
      if (!orderData.email.trim()) newErrors.email = 'Email обязателен'
      else if (!/\S+@\S+\.\S+/.test(orderData.email)) newErrors.email = 'Неверный формат email'
    }

    if (step === 1) {
      if (!orderData.paymentMethod) newErrors.paymentMethod = 'Выберите способ оплаты'
    }

    if (step === 2) {
      if (!orderData.termsAccepted) newErrors.terms = 'Необходимо принять условия'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleNext = () => {
    if (validateStep(activeStep)) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const handleCompleteOrder = async () => {
    if (!validateStep(activeStep)) return

    setIsProcessing(true)

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000))

      // Generate QR code for pickup
      const pickupCode = `SAQTAU-${Date.now().toString().slice(-8)}`

      // Create order object
      const order: Order = {
        id: `order_${Date.now()}`,
        userId: 'guest',
        cart,
        status: 'confirmed',
        paymentMethod: orderData.paymentMethod,
        paymentStatus: 'pending',
        pickupCode,
        notes: orderData.notes,
        createdAt: new Date(),
        updatedAt: new Date(),
      }

      // Clear cart and navigate to success page
      clearCart()
      navigate(`/order-success/${order.id}`, { state: { order, orderData } })
    } catch (error) {
      console.error('Order completion failed:', error)
      setErrors({ general: 'Ошибка при оформлении заказа. Попробуйте снова.' })
    } finally {
      setIsProcessing(false)
    }
  }

  const updateOrderData = (field: string, value: any) => {
    setOrderData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0: // Contact Information
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Контактная информация
            </Typography>

            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Имя"
                  value={orderData.firstName}
                  onChange={(e) => updateOrderData('firstName', e.target.value)}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Фамилия"
                  value={orderData.lastName}
                  onChange={(e) => updateOrderData('lastName', e.target.value)}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  InputProps={{
                    startAdornment: <Person sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Телефон"
                  value={orderData.phone}
                  onChange={(e) => updateOrderData('phone', e.target.value)}
                  error={!!errors.phone}
                  helperText={errors.phone}
                  placeholder="+7 (___) ___-__-__"
                  InputProps={{
                    startAdornment: <Phone sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  label="Email"
                  type="email"
                  value={orderData.email}
                  onChange={(e) => updateOrderData('email', e.target.value)}
                  error={!!errors.email}
                  helperText={errors.email}
                  InputProps={{
                    startAdornment: <Email sx={{ mr: 1, color: 'action.active' }} />,
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Комментарий к заказу (опционально)"
                  multiline
                  rows={3}
                  value={orderData.notes}
                  onChange={(e) => updateOrderData('notes', e.target.value)}
                  placeholder="Укажите пожелания по доставке или особые требования..."
                />
              </Grid>
            </Grid>
          </motion.div>
        )

      case 1: // Payment
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Способ оплаты
            </Typography>

            <FormControl component="fieldset" error={!!errors.paymentMethod}>
              <FormLabel component="legend" sx={{ mb: 2, fontWeight: 600 }}>
                Выберите удобный способ оплаты
              </FormLabel>
              <RadioGroup
                value={orderData.paymentMethod}
                onChange={(e) => updateOrderData('paymentMethod', e.target.value)}
              >
                <Card
                  sx={{
                    mb: 2,
                    border: orderData.paymentMethod === 'kaspi' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => updateOrderData('paymentMethod', 'kaspi')}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="kaspi" sx={{ mr: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#FF6B35',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                            K
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Kaspi Pay
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Быстрая оплата через Kaspi Bank
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    mb: 2,
                    border: orderData.paymentMethod === 'halyk' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => updateOrderData('paymentMethod', 'halyk')}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="halyk" sx={{ mr: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Box
                          sx={{
                            width: 40,
                            height: 40,
                            bgcolor: '#00AEEF',
                            borderRadius: 1,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mr: 2,
                          }}
                        >
                          <Typography variant="h6" sx={{ color: 'white', fontWeight: 'bold' }}>
                            H
                          </Typography>
                        </Box>
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Halyk Pay
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Оплата через Halyk Bank
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    mb: 2,
                    border: orderData.paymentMethod === 'card' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => updateOrderData('paymentMethod', 'card')}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="card" sx={{ mr: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <CreditCard sx={{ fontSize: 40, color: theme.palette.primary.main, mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Банковская карта
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Visa, Mastercard, American Express
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>

                <Card
                  sx={{
                    mb: 2,
                    border: orderData.paymentMethod === 'cash' ? `2px solid ${theme.palette.primary.main}` : '1px solid #e0e0e0',
                    cursor: 'pointer',
                  }}
                  onClick={() => updateOrderData('paymentMethod', 'cash')}
                >
                  <CardContent sx={{ p: 2 }}>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Radio value="cash" sx={{ mr: 2 }} />
                      <Box sx={{ display: 'flex', alignItems: 'center', flexGrow: 1 }}>
                        <Money sx={{ fontSize: 40, color: '#4CAF50', mr: 2 }} />
                        <Box>
                          <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                            Наличными при получении
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            Оплата курьеру или на месте
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              </RadioGroup>
              {errors.paymentMethod && (
                <Typography variant="caption" color="error" sx={{ mt: 1 }}>
                  {errors.paymentMethod}
                </Typography>
              )}
            </FormControl>

            <Box sx={{ mt: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderData.savePaymentInfo}
                    onChange={(e) => updateOrderData('savePaymentInfo', e.target.checked)}
                  />
                }
                label="Сохранить данные для будущих покупок"
              />
            </Box>
          </motion.div>
        )

      case 2: // Confirmation
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Подтверждение заказа
            </Typography>

            {/* Order Summary */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Состав заказа
                </Typography>
                {cart.items.map((item) => (
                  <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                    <Typography variant="body2">
                      {item.product.title} × {item.quantity}
                    </Typography>
                    <Typography variant="body2" sx={{ fontWeight: 600 }}>
                      {(item.product.discountPrice * item.quantity).toLocaleString()} ₸
                    </Typography>
                  </Box>
                ))}
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography variant="body2">Итого к оплате:</Typography>
                  <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                    {cart.finalTotal.toLocaleString()} ₸
                  </Typography>
                </Box>
              </CardContent>
            </Card>

            {/* Contact Info */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Контактная информация
                </Typography>
                <Typography variant="body2">
                  {orderData.firstName} {orderData.lastName}
                </Typography>
                <Typography variant="body2">{orderData.phone}</Typography>
                <Typography variant="body2">{orderData.email}</Typography>
                {orderData.notes && (
                  <Typography variant="body2" sx={{ mt: 1, fontStyle: 'italic' }}>
                    Комментарий: {orderData.notes}
                  </Typography>
                )}
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card sx={{ mb: 3, borderRadius: 2 }}>
              <CardContent sx={{ p: 3 }}>
                <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                  Способ оплаты
                </Typography>
                <Typography variant="body2">
                  {orderData.paymentMethod === 'kaspi' && 'Kaspi Pay'}
                  {orderData.paymentMethod === 'halyk' && 'Halyk Pay'}
                  {orderData.paymentMethod === 'card' && 'Банковская карта'}
                  {orderData.paymentMethod === 'cash' && 'Наличными при получении'}
                </Typography>
              </CardContent>
            </Card>

            {/* Terms and Conditions */}
            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderData.termsAccepted}
                    onChange={(e) => updateOrderData('termsAccepted', e.target.checked)}
                  />
                }
                label={
                  <Typography variant="body2">
                    Я согласен с{' '}
                    <Button variant="text" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}>
                      условиями использования
                    </Button>{' '}
                    и{' '}
                    <Button variant="text" sx={{ p: 0, minWidth: 'auto', textTransform: 'none' }}>
                      политикой конфиденциальности
                    </Button>
                  </Typography>
                }
              />
              {errors.terms && (
                <Typography variant="caption" color="error" sx={{ ml: 4 }}>
                  {errors.terms}
                </Typography>
              )}
            </Box>

            <Box sx={{ mb: 3 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={orderData.marketingConsent}
                    onChange={(e) => updateOrderData('marketingConsent', e.target.checked)}
                  />
                }
                label="Я согласен получать маркетинговые предложения и обновления"
              />
            </Box>

            {errors.general && (
              <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>
                {errors.general}
              </Alert>
            )}
          </motion.div>
        )

      default:
        return null
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      {/* Header */}
      <Box sx={{ mb: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
          Оформление заказа
        </Typography>
        <Typography variant="body1" color="text.secondary">
          {cart.items.length} товаров • {cart.finalTotal.toLocaleString()} ₸
        </Typography>
      </Box>

      {/* Stepper */}
      <Box sx={{ mb: 4 }}>
        <Stepper activeStep={activeStep} alternativeLabel={!isMobile}>
          {steps.map((label, index) => (
            <Step key={label}>
              <StepLabel
                StepIconProps={{
                  sx: {
                    '&.Mui-active': { color: theme.palette.primary.main },
                    '&.Mui-completed': { color: theme.palette.success.main },
                  },
                }}
              >
                {label}
              </StepLabel>
            </Step>
          ))}
        </Stepper>
      </Box>

      {/* Step Content */}
      <AnimatePresence mode="wait">
        <Box key={activeStep} sx={{ minHeight: 400 }}>
          {renderStepContent(activeStep)}
        </Box>
      </AnimatePresence>

      {/* Navigation Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
        <Button
          disabled={activeStep === 0}
          onClick={handleBack}
          startIcon={<ArrowBack />}
          variant="outlined"
          sx={{ borderRadius: 2 }}
        >
          Назад
        </Button>

        <Button
          variant="contained"
          onClick={activeStep === steps.length - 1 ? handleCompleteOrder : handleNext}
          endIcon={activeStep === steps.length - 1 ? <CheckCircle /> : <ArrowForward />}
          disabled={isProcessing}
          sx={{
            borderRadius: 2,
            px: 4,
            background: activeStep === steps.length - 1
              ? `linear-gradient(135deg, ${theme.palette.success.main} 0%, ${theme.palette.success.dark} 100%)`
              : undefined,
          }}
        >
          {isProcessing
            ? 'Обработка...'
            : activeStep === steps.length - 1
            ? 'Подтвердить заказ'
            : 'Далее'
          }
        </Button>
      </Box>
    </Container>
  )
}

export default CheckoutPage
