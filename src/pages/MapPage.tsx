import { useEffect, useMemo, useState } from 'react'
import { Box, Typography, Container, Card, CardContent, Grid, useTheme } from '@mui/material'
import { useTranslation } from 'react-i18next'
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import { mockProducts } from '../utils/mockData'
import { Product } from '../types'
import MapFilters, { MapFiltersState } from '../components/MapFilters'
import ProductCard from '../components/ProductCard'

// Fix default marker icons for Leaflet in bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
})

const MapPage = () => {
  const { t } = useTranslation()
  const theme = useTheme()

  const [filters, setFilters] = useState<MapFiltersState>({
    search: '',
    category: 'all',
    maxDistance: 25,
  })

  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number } | null>(null)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () => {
          // Default to Astana
          setUserLocation({ lat: 51.1694, lng: 71.4491 })
        }
      )
    } else {
      setUserLocation({ lat: 51.1694, lng: 71.4491 })
    }
  }, [])

  const calculateDistance = (a: { lat: number; lng: number }, b: { lat: number; lng: number }) => {
    const R = 6371
    const dLat = ((b.lat - a.lat) * Math.PI) / 180
    const dLng = ((b.lng - a.lng) * Math.PI) / 180
    const la1 = (a.lat * Math.PI) / 180
    const la2 = (b.lat * Math.PI) / 180

    const sinDLat = Math.sin(dLat / 2)
    const sinDLng = Math.sin(dLng / 2)

    const c =
      sinDLat * sinDLat +
      sinDLng * sinDLng * Math.cos(la1) * Math.cos(la2)
    const d = 2 * Math.atan2(Math.sqrt(c), Math.sqrt(1 - c))
    return R * d
  }

  const filteredProducts = useMemo(() => {
    return mockProducts.filter((product) => {
      if (filters.category !== 'all' && product.category !== filters.category) return false

      if (filters.search) {
        const q = filters.search.toLowerCase()
        const matches =
          product.title.toLowerCase().includes(q) ||
          product.description.toLowerCase().includes(q) ||
          product.partnerName.toLowerCase().includes(q) ||
          product.tags.some((t) => t.toLowerCase().includes(q))
        if (!matches) return false
      }

      if (userLocation && filters.maxDistance) {
        const distance = calculateDistance(userLocation, product.location)
        if (distance > filters.maxDistance) return false
      }

      return true
    })
  }, [filters, userLocation])

  const mapCenter = userLocation || { lat: 48.0196, lng: 66.9237 }

  return (
    <Container maxWidth="xl" sx={{ py: 3 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700, mb: 3 }}>
        {t('nav.map')}
      </Typography>

      <Grid container spacing={3}>
        {/* Map and filters */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3, mb: 2 }}>
            <CardContent sx={{ p: 0 }}>
              <Box sx={{ height: { xs: 360, md: 520 }, borderRadius: 3, overflow: 'hidden' }}>
                <MapContainer
                  center={[mapCenter.lat, mapCenter.lng]}
                  zoom={5}
                  style={{ height: '100%', width: '100%' }}
                >
                  <TileLayer
                    attribution='&copy; OpenStreetMap contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {filteredProducts.map((product) => (
                    <Marker
                      key={product.id}
                      position={[product.location.lat, product.location.lng]}
                      eventHandlers={{
                        click: () => setSelectedProduct(product),
                      }}
                    >
                      <Popup>
                        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
                          {product.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {product.partnerName}
                        </Typography>
                        <Typography variant="body2" sx={{ mt: 0.5 }}>
                          {product.discountPrice.toLocaleString()} ₸{' '}
                          <Typography
                            component="span"
                            variant="body2"
                            sx={{ textDecoration: 'line-through', color: 'text.secondary', ml: 0.5 }}
                          >
                            {product.originalPrice.toLocaleString()} ₸
                          </Typography>
                        </Typography>
                      </Popup>
                    </Marker>
                  ))}

                  {userLocation && (
                    <Marker position={[userLocation.lat, userLocation.lng]}>
                      <Popup>
                        <Typography variant="body2">Вы здесь</Typography>
                      </Popup>
                    </Marker>
                  )}
                </MapContainer>
              </Box>
            </CardContent>
          </Card>

          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ p: 0 }}>
              <MapFilters filters={filters} setFilters={setFilters} />
            </CardContent>
          </Card>
        </Grid>

        {/* Side panel with offers */}
        <Grid item xs={12} md={4}>
          <Card
            sx={{
              borderRadius: 3,
              height: { xs: 'auto', md: '100%' },
              maxHeight: { md: 520 },
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <CardContent sx={{ p: 2, pb: 1 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                Предложения рядом
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Найдено: {filteredProducts.length}
              </Typography>
            </CardContent>
            <Box
              sx={{
                px: 2,
                pb: 2,
                flexGrow: 1,
                overflowY: 'auto',
                '&::-webkit-scrollbar': { width: 6 },
                '&::-webkit-scrollbar-thumb': {
                  backgroundColor: theme.palette.action.hover,
                  borderRadius: 3,
                },
              }}
            >
              <Grid container spacing={2}>
                {filteredProducts.map((product) => (
                  <Grid item xs={12} key={product.id}>
                    <ProductCard product={product} onViewDetails={setSelectedProduct} />
                  </Grid>
                ))}
                {filteredProducts.length === 0 && (
                  <Grid item xs={12}>
                    <Typography variant="body2" color="text.secondary">
                      В выбранном радиусе пока нет предложений. Попробуйте изменить фильтры.
                    </Typography>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default MapPage

