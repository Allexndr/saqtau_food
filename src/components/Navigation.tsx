import { useState } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Button,
  Menu,
  MenuItem,
  Badge,
  useTheme,
  useMediaQuery,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
} from '@mui/material'
import {
  Menu as MenuIcon,
  Home,
  Map,
  ShoppingBag,
  ShoppingCart,
  Person,
  Business,
  Language,
} from '@mui/icons-material'
import { useTranslation } from 'react-i18next'
import { useCart } from '../hooks/useCart'

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t, i18n } = useTranslation()
  const { cart } = useCart()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null)

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen)
  }

  const handleLanguageMenu = (event: React.MouseEvent<HTMLElement>) => {
    setLangAnchorEl(event.currentTarget)
  }

  const handleLanguageClose = () => {
    setLangAnchorEl(null)
  }

  const handleLanguageChange = (lang: string) => {
    i18n.changeLanguage(lang)
    handleLanguageClose()
  }

  const navigationItems = [
    { path: '/', label: t('nav.home'), icon: Home },
    { path: '/map', label: t('nav.map'), icon: Map },
    { path: '/offers', label: t('nav.offers'), icon: ShoppingBag },
    { path: '/partners', label: t('nav.partners'), icon: Business },
  ]

  const drawer = (
    <Box sx={{ width: 280 }}>
      <Box sx={{ p: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Typography variant="h6" component="div" sx={{ fontWeight: 700 }}>
          Saqtau
        </Typography>
        <Typography variant="h6" component="div" sx={{ color: theme.palette.primary.main, fontWeight: 700 }}>
          Platform
        </Typography>
      </Box>
      <Divider />
      <List>
        {navigationItems.map((item) => {
          const Icon = item.icon
          return (
            <ListItem key={item.path} disablePadding>
              <ListItemButton
                onClick={() => {
                  navigate(item.path)
                  setMobileOpen(false)
                }}
                selected={location.pathname === item.path}
              >
                <ListItemIcon>
                  <Icon color={location.pathname === item.path ? 'primary' : 'inherit'} />
                </ListItemIcon>
                <ListItemText primary={item.label} />
              </ListItemButton>
            </ListItem>
          )
        })}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate('/profile')}>
            <ListItemIcon>
              <Person />
            </ListItemIcon>
            <ListItemText primary={t('nav.profile')} />
          </ListItemButton>
        </ListItem>
      </List>
    </Box>
  )

  return (
    <>
      <AppBar position="sticky" elevation={0}>
        <Toolbar>
          {/* Mobile menu button */}
          {isMobile && (
            <IconButton
              color="inherit"
              aria-label="open drawer"
              edge="start"
              onClick={handleDrawerToggle}
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          {/* Logo */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexGrow: 1 }}>
            <Typography
              variant="h6"
              component="div"
              sx={{
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => navigate('/')}
            >
              Saqtau
            </Typography>
            <Typography
              variant="h6"
              component="div"
              sx={{
                color: theme.palette.primary.main,
                fontWeight: 700,
                cursor: 'pointer',
                '&:hover': { opacity: 0.8 }
              }}
              onClick={() => navigate('/')}
            >
              Platform
            </Typography>
          </Box>

          {/* Desktop Navigation */}
          {!isMobile && (
            <Box sx={{ display: 'flex', gap: 2, mr: 2 }}>
              {navigationItems.map((item) => (
                <Button
                  key={item.path}
                  color="inherit"
                  onClick={() => navigate(item.path)}
                  sx={{
                    fontWeight: location.pathname === item.path ? 600 : 500,
                    borderBottom: location.pathname === item.path
                      ? `2px solid ${theme.palette.primary.main}`
                      : 'none',
                    borderRadius: 0,
                    pb: 1,
                    '&:hover': {
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    },
                  }}
                >
                  {item.label}
                </Button>
              ))}
            </Box>
          )}

          {/* Action buttons */}
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            {/* Language selector */}
            <IconButton
              color="inherit"
              onClick={handleLanguageMenu}
              sx={{ mr: 1 }}
            >
              <Language />
            </IconButton>

            {/* Cart */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/cart')}
              sx={{ mr: 1 }}
            >
              <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                <ShoppingCart />
              </Badge>
            </IconButton>

            {/* Profile */}
            <IconButton
              color="inherit"
              onClick={() => navigate('/profile')}
            >
              <Person />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {/* Language Menu */}
      <Menu
        anchorEl={langAnchorEl}
        open={Boolean(langAnchorEl)}
        onClose={handleLanguageClose}
      >
        <MenuItem onClick={() => handleLanguageChange('ru')}>
          🇷🇺 Русский
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('kz')}>
          🇰🇿 Қазақша
        </MenuItem>
        <MenuItem onClick={() => handleLanguageChange('en')}>
          🇺🇸 English
        </MenuItem>
      </Menu>

      {/* Mobile Drawer */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': { boxSizing: 'border-box', width: 280 },
        }}
      >
        {drawer}
      </Drawer>
    </>
  )
}

export default Navigation
