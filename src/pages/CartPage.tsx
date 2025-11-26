import { Box, Typography, Container } from '@mui/material'
import { useTranslation } from 'react-i18next'

const CartPage = () => {
  const { t } = useTranslation()

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        {t('nav.cart')}
      </Typography>
      <Box sx={{ height: '50vh', bgcolor: 'grey.100', borderRadius: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Typography variant="h6" color="text.secondary">
          Корзина будет здесь
        </Typography>
      </Box>
    </Container>
  )
}

export default CartPage
