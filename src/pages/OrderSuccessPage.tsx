import { useEffect, useState } from 'react'
import { useParams, useLocation, useNavigate } from 'react-router-dom'
import {
  Container,
  Box,
  Typography,
  Card,
  CardContent,
  Button,
  Grid,
  Chip,
  Divider,
  Alert,
  useTheme,
} from '@mui/material'
import {
  CheckCircle,
  QrCode,
  Share,
  Download,
  ShoppingBag,
  AccessTime,
  LocationOn,
  Phone,
  Email,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import QRCode from 'qrcode'
import { Order } from '../types'

const OrderSuccessPage = () => {
  const theme = useTheme()
  const { t } = useTranslation()
  const { orderId } = useParams()
  const location = useLocation()
  const navigate = useNavigate()

  const [qrCodeUrl, setQrCodeUrl] = useState('')
  const [order] = useState<Order | null>(location.state?.order || null)
  const [orderData] = useState(location.state?.orderData || null)

  useEffect(() => {
    if (!order) {
      navigate('/')
      return
    }

    // Generate QR code
    const generateQR = async () => {
      try {
        const qrData = JSON.stringify({
          orderId: order.id,
          pickupCode: order.pickupCode,
          timestamp: new Date().toISOString(),
        })

        const qrUrl = await QRCode.toDataURL(qrData, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF',
          },
        })
        setQrCodeUrl(qrUrl)
      } catch (error) {
        console.error('QR code generation failed:', error)
      }
    }

    generateQR()
  }, [order, navigate])

  if (!order || !orderData) {
    return (
      <Container maxWidth="md" sx={{ py: 8 }}>
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          Заказ не найден. Возвращаемся на главную...
        </Alert>
      </Container>
    )
  }

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: 'Мой заказ в Saqtau Platform',
          text: `Заказ ${order.id} готов к выдаче. Код получения: ${order.pickupCode}`,
          url: window.location.href,
        })
      } catch (error) {
        console.log('Share failed:', error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(
        `Мой заказ в Saqtau Platform: ${order.id}. Код получения: ${order.pickupCode}`
      )
    }
  }

  const handleDownloadQR = () => {
    if (qrCodeUrl) {
      const link = document.createElement('a')
      link.href = qrCodeUrl
      link.download = `saqtau-order-${order.id}-qr.png`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        {/* Success Header */}
        <Box sx={{ textAlign: 'center', mb: 4 }}>
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <CheckCircle
              sx={{
                fontSize: 80,
                color: theme.palette.success.main,
                mb: 2,
              }}
            />
          </motion.div>

          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 2 }}>
            Заказ успешно оформлен! 🎉
          </Typography>

          <Typography variant="h6" color="text.secondary" sx={{ mb: 1 }}>
            Заказ #{order.id}
          </Typography>

          <Typography variant="body1" color="text.secondary">
            Код получения: <strong>{order.pickupCode}</strong>
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* QR Code Section */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card sx={{ borderRadius: 3, textAlign: 'center', height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <QrCode sx={{ fontSize: 48, color: theme.palette.primary.main, mb: 2 }} />
                  <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                    QR-код для получения
                  </Typography>

                  {qrCodeUrl && (
                    <Box sx={{ mb: 3 }}>
                      <img
                        src={qrCodeUrl}
                        alt="QR Code"
                        style={{
                          width: '200px',
                          height: '200px',
                          borderRadius: '8px',
                          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                        }}
                      />
                    </Box>
                  )}

                  <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                    Покажите этот QR-код при получении заказа в пункте выдачи
                  </Typography>

                  <Box sx={{ display: 'flex', gap: 1, justifyContent: 'center' }}>
                    <Button
                      variant="outlined"
                      startIcon={<Download />}
                      onClick={handleDownloadQR}
                      size="small"
                    >
                      Скачать
                    </Button>
                    <Button
                      variant="outlined"
                      startIcon={<Share />}
                      onClick={handleShare}
                      size="small"
                    >
                      Поделиться
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>

          {/* Order Details */}
          <Grid item xs={12} md={6}>
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <Card sx={{ borderRadius: 3, height: '100%' }}>
                <CardContent sx={{ p: 3 }}>
                  <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                    Детали заказа
                  </Typography>

                  {/* Status */}
                  <Box sx={{ mb: 3 }}>
                    <Chip
                      label="Подтвержден"
                      color="success"
                      sx={{ fontWeight: 600 }}
                    />
                  </Box>

                  {/* Order Items */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Состав заказа:
                    </Typography>
                    {order.cart.items.map((item) => (
                      <Box key={item.productId} sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                        <Typography variant="body2">
                          {item.product.title}
                        </Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>
                          {item.quantity} × {(item.product.discountPrice).toLocaleString()} ₸
                        </Typography>
                      </Box>
                    ))}
                  </Box>

                  <Divider sx={{ my: 2 }} />

                  {/* Total */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: 700 }}>
                      Итого к оплате:
                    </Typography>
                    <Typography variant="h6" sx={{ fontWeight: 700, color: theme.palette.primary.main }}>
                      {order.cart.finalTotal.toLocaleString()} ₸
                    </Typography>
                  </Box>

                  {/* Contact Info */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Контактная информация:
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                      <Phone sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{orderData.phone}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <Email sx={{ fontSize: 16, mr: 1, color: 'text.secondary' }} />
                      <Typography variant="body2">{orderData.email}</Typography>
                    </Box>
                  </Box>

                  {/* Payment Method */}
                  <Box sx={{ mb: 3 }}>
                    <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
                      Способ оплаты:
                    </Typography>
                    <Typography variant="body2">
                      {order.paymentMethod === 'kaspi' && 'Kaspi Pay'}
                      {order.paymentMethod === 'halyk' && 'Halyk Pay'}
                      {order.paymentMethod === 'card' && 'Банковская карта'}
                      {order.paymentMethod === 'cash' && 'Наличными при получении'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            </motion.div>
          </Grid>
        </Grid>

        {/* Next Steps */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.8 }}
        >
          <Card sx={{ mt: 4, borderRadius: 3, bgcolor: 'background.paper' }}>
            <CardContent sx={{ p: 3 }}>
              <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                Что делать дальше?
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <AccessTime sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      1. Дождитесь подтверждения
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Мы обработаем ваш заказ в ближайшее время
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <LocationOn sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      2. Приходите за заказом
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Покажите QR-код в пункте выдачи партнера
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} sm={4}>
                  <Box sx={{ textAlign: 'center', p: 2 }}>
                    <ShoppingBag sx={{ fontSize: 40, color: theme.palette.primary.main, mb: 1 }} />
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                      3. Получите свой заказ
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      Наслаждайтесь свежими продуктами!
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </motion.div>

        {/* Action Buttons */}
        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 4 }}>
          <Button
            variant="outlined"
            onClick={() => navigate('/offers')}
            startIcon={<ShoppingBag />}
            sx={{ borderRadius: 2 }}
          >
            Продолжить покупки
          </Button>

          <Button
            variant="contained"
            onClick={() => navigate('/profile')}
            sx={{
              borderRadius: 2,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
            }}
          >
            Мои заказы
          </Button>
        </Box>
      </motion.div>
    </Container>
  )
}

export default OrderSuccessPage
