import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Box,
  Container,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Chip,
  useTheme,
  useMediaQuery,
  Fade,
  Zoom,
} from '@mui/material'
import {
  Restaurant,
  Checkroom,
  TrendingUp,
  People,
  LocationOn,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { motion } from 'framer-motion'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

// Fix for default markers in react-leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const HomePage = () => {
  const navigate = useNavigate()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t } = useTranslation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Mock data for the map preview
  const mockLocations = [
    { id: 1, lat: 51.1694, lng: 71.4491, name: 'SaqtauFood Астана', type: 'food' },
    { id: 2, lat: 43.2567, lng: 76.9286, name: 'SaqtauKiem Алматы', type: 'fashion' },
    { id: 3, lat: 50.2833, lng: 57.1667, name: 'SaqtauFood Актобе', type: 'food' },
  ]

  const stats = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.success.main }} />,
      value: '25,000+',
      label: t('hero.stats.saved'),
      color: theme.palette.success.main,
    },
    {
      icon: <People sx={{ fontSize: 40, color: theme.palette.primary.main }} />,
      value: '150+',
      label: t('hero.stats.partners'),
      color: theme.palette.primary.main,
    },
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: theme.palette.secondary.main }} />,
      value: '8,500+',
      label: t('hero.stats.users'),
      color: theme.palette.secondary.main,
    },
    {
      icon: <LocationOn sx={{ fontSize: 40, color: theme.palette.warning.main }} />,
      value: '50 тн',
      label: t('hero.stats.co2'),
      color: theme.palette.warning.main,
    },
  ]

  const features = [
    {
      icon: <Restaurant sx={{ fontSize: 48, color: '#2E7D32' }} />,
      title: 'SaqtauFood',
      description: 'Спасаем еду от утилизации: свежие продукты со скидками до 70%',
      category: 'food',
      buttonText: t('hero.exploreFood'),
    },
    {
      icon: <Checkroom sx={{ fontSize: 48, color: '#2196F3' }} />,
      title: 'SaqtauKiem',
      description: 'Одежда и аксессуары от проверенных брендов по выгодным ценам',
      category: 'fashion',
      buttonText: t('hero.exploreFashion'),
    },
  ]

  return (
    <Box>
      {/* Hero Section */}
      <Box
        sx={{
          background: `linear-gradient(135deg, ${theme.palette.primary.main}15 0%, ${theme.palette.secondary.main}15 100%)`,
          py: { xs: 8, md: 12 },
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        <Container maxWidth="lg">
          <Grid container spacing={6} alignItems="center">
            <Grid item xs={12} md={6}>
              <Fade in={isVisible} timeout={1000}>
                <Box>
                  <Typography
                    variant="h1"
                    component="h1"
                    sx={{
                      fontSize: { xs: '2.5rem', md: '3.5rem' },
                      fontWeight: 800,
                      mb: 3,
                      background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
                      backgroundClip: 'text',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      lineHeight: 1.2,
                    }}
                  >
                    {t('hero.title')}
                  </Typography>

                  <Typography
                    variant="h5"
                    sx={{
                      mb: 4,
                      color: theme.palette.text.secondary,
                      fontSize: { xs: '1.1rem', md: '1.25rem' },
                      lineHeight: 1.6,
                    }}
                  >
                    {t('hero.subtitle')}
                  </Typography>

                  <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 2, mb: 6 }}>
                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/offers?category=food')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 25,
                        background: 'linear-gradient(135deg, #2E7D32 0%, #4CAF50 100%)',
                        boxShadow: '0 4px 15px rgba(46, 125, 50, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #1B5E20 0%, #388E3C 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(46, 125, 50, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      🍎 {t('hero.exploreFood')}
                    </Button>

                    <Button
                      variant="contained"
                      size="large"
                      onClick={() => navigate('/offers?category=fashion')}
                      sx={{
                        py: 1.5,
                        px: 4,
                        fontSize: '1.1rem',
                        fontWeight: 600,
                        borderRadius: 25,
                        background: 'linear-gradient(135deg, #2196F3 0%, #03A9F4 100%)',
                        boxShadow: '0 4px 15px rgba(33, 150, 243, 0.3)',
                        '&:hover': {
                          background: 'linear-gradient(135deg, #0D47A1 0%, #0277BD 100%)',
                          transform: 'translateY(-2px)',
                          boxShadow: '0 6px 20px rgba(33, 150, 243, 0.4)',
                        },
                        transition: 'all 0.3s ease',
                      }}
                    >
                      👕 {t('hero.exploreFashion')}
                    </Button>
                  </Box>
                </Box>
              </Fade>
            </Grid>

            <Grid item xs={12} md={6}>
              <Zoom in={isVisible} timeout={1500}>
                <Box
                  sx={{
                    height: { xs: 300, md: 400 },
                    borderRadius: 3,
                    overflow: 'hidden',
                    boxShadow: '0 20px 40px rgba(0, 0, 0, 0.1)',
                  }}
                >
                  <MapContainer
                    center={[48.0196, 66.9237]} // Center of Kazakhstan
                    zoom={5}
                    style={{ height: '100%', width: '100%' }}
                    zoomControl={false}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    {mockLocations.map((location) => (
                      <Marker
                        key={location.id}
                        position={[location.lat, location.lng]}
                      >
                        <Popup>
                          <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                            {location.name}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {location.type === 'food' ? '🍎 Еда' : '👕 Одежда'}
                          </Typography>
                        </Popup>
                      </Marker>
                    ))}
                  </MapContainer>
                </Box>
              </Zoom>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* Stats Section */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Grid container spacing={4}>
            {stats.map((stat, index) => (
              <Grid item xs={6} md={3} key={index}>
                <Zoom in={isVisible} timeout={1000 + index * 200}>
                  <Card
                    sx={{
                      textAlign: 'center',
                      py: 3,
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'transform 0.3s ease, box-shadow 0.3s ease',
                      '&:hover': {
                        transform: 'translateY(-4px)',
                        boxShadow: '0 8px 25px rgba(0, 0, 0, 0.1)',
                      },
                    }}
                  >
                    <CardContent>
                      <Box sx={{ mb: 2 }}>
                        {stat.icon}
                      </Box>
                      <Typography
                        variant="h3"
                        sx={{
                          fontWeight: 800,
                          mb: 1,
                          color: stat.color,
                        }}
                      >
                        {stat.value}
                      </Typography>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontWeight: 500 }}
                      >
                        {stat.label}
                      </Typography>
                    </CardContent>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* Features Section */}
      <Box sx={{ py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.secondary.main} 100%)`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Наши сервисы
          </Typography>

          <Grid container spacing={4}>
            {features.map((feature, index) => (
              <Grid item xs={12} md={6} key={index}>
                <Fade in={isVisible} timeout={1200 + index * 300}>
                  <Card
                    sx={{
                      height: '100%',
                      borderRadius: 3,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer',
                      '&:hover': {
                        transform: 'translateY(-8px)',
                        boxShadow: '0 20px 40px rgba(0, 0, 0, 0.15)',
                      },
                    }}
                    onClick={() => navigate(`/offers?category=${feature.category}`)}
                  >
                    <CardContent sx={{ p: 4, textAlign: 'center' }}>
                      <Box sx={{ mb: 3 }}>
                        {feature.icon}
                      </Box>
                      <Typography
                        variant="h4"
                        sx={{ mb: 2, fontWeight: 600 }}
                      >
                        {feature.title}
                      </Typography>
                      <Typography
                        variant="body1"
                        color="text.secondary"
                        sx={{ mb: 3, lineHeight: 1.6 }}
                      >
                        {feature.description}
                      </Typography>
                      <Button
                        variant="outlined"
                        size="large"
                        sx={{
                          borderRadius: 25,
                          px: 3,
                          py: 1,
                          fontWeight: 600,
                        }}
                      >
                        {feature.buttonText}
                      </Button>
                    </CardContent>
                  </Card>
                </Fade>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>

      {/* AI Features Preview */}
      <Box sx={{ py: 8, backgroundColor: 'background.paper' }}>
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            textAlign="center"
            sx={{
              mb: 6,
              fontWeight: 700,
              color: theme.palette.primary.main,
            }}
          >
            🚀 ИИ-функции платформы
          </Typography>

          <Grid container spacing={3}>
            {[
              {
                title: t('ai.recommendations'),
                description: 'Персонализированные предложения на основе ваших предпочтений',
                icon: '🎯',
              },
              {
                title: t('ai.smartSearch'),
                description: 'Умный поиск с распознаванием изображений и голосовым вводом',
                icon: '🔍',
              },
              {
                title: t('ai.priceOptimization'),
                description: 'Динамическое ценообразование с учетом спроса и предложения',
                icon: '📈',
              },
              {
                title: t('ai.demandPrediction'),
                description: 'Прогноз спроса для оптимизации запасов партнеров',
                icon: '🔮',
              },
            ].map((aiFeature, index) => (
              <Grid item xs={12} sm={6} md={3} key={index}>
                <Zoom in={isVisible} timeout={1400 + index * 200}>
                  <Card
                    sx={{
                      height: '100%',
                      textAlign: 'center',
                      p: 3,
                      borderRadius: 3,
                      background: `linear-gradient(135deg, ${theme.palette.background.paper} 0%, ${theme.palette.action.hover} 100%)`,
                      border: `1px solid ${theme.palette.divider}`,
                    }}
                  >
                    <Typography variant="h1" sx={{ mb: 2 }}>
                      {aiFeature.icon}
                    </Typography>
                    <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
                      {aiFeature.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {aiFeature.description}
                    </Typography>
                  </Card>
                </Zoom>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage
