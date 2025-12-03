import { Routes, Route } from 'react-router-dom'
import { Box } from '@mui/material'
import Navigation from './components/Navigation'
import HomePage from './pages/HomePage'
import MapPage from './pages/MapPage'
import OffersPage from './pages/OffersPage'
import CartPage from './pages/CartPage'
import ProfilePage from './pages/ProfilePage'
import PartnersPage from './pages/PartnersPage'
import CheckoutPage from './pages/CheckoutPage'
import OrderSuccessPage from './pages/OrderSuccessPage'
import PartnerPanel from './pages/PartnerPanel'
import './App.css'

function App() {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <Navigation />
      <Box component="main" sx={{ flexGrow: 1 }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/map" element={<MapPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/order-success/:orderId" element={<OrderSuccessPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/partners" element={<PartnersPage />} />
          <Route path="/partner-panel" element={<PartnerPanel />} />
        </Routes>
      </Box>
    </Box>
  )
}

export default App
