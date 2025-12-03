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
  Divider, Grid,
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
import NotificationCenter from './NotificationCenter'

// Mock auth state - in real app this would come from context/store
const mockAuth = {
  isAuthenticated: false,
  user: null,
  role: null, // 'user' | 'partner' | 'admin'
}

const Navigation = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const theme = useTheme()
  const isMobile = useMediaQuery(theme.breakpoints.down('md'))
  const { t, i18n } = useTranslation()
  const { cart } = useCart()

  const [mobileOpen, setMobileOpen] = useState(false)
  const [langAnchorEl, setLangAnchorEl] = useState<null | HTMLElement>(null)
  const [authDialog, setAuthDialog] = useState(false)
  const [authTab, setAuthTab] = useState(0) // 0 - login, 1 - register
  const [loginData, setLoginData] = useState({ email: '', password: '', role: 'user' })
  const [registerData, setRegisterData] = useState({
    email: '', password: '', confirmPassword: '', firstName: '', lastName: '', phone: '', role: 'user'
  })

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

            {mockAuth.isAuthenticated ? (
              <>
                {/* Cart - only for buyers */}
                {mockAuth.role !== 'partner' && (
                  <IconButton
                    color="inherit"
                    onClick={() => navigate('/cart')}
                    sx={{ mr: 1 }}
                  >
                    <Badge badgeContent={cart?.items?.length || 0} color="secondary">
                      <ShoppingCart />
                    </Badge>
                  </IconButton>
                )}

                {/* Seller Dashboard - only for partners */}
                {mockAuth.role === 'partner' && (
                  <Button
                    color="inherit"
                    startIcon={<Dashboard />}
                    onClick={() => navigate('/seller-dashboard')}
                    sx={{ mr: 1 }}
                  >
                    {!isMobile && 'Кабинет'}
                  </Button>
                )}

                {/* Notifications */}
                <NotificationCenter userId={mockAuth.user?.id} />

                {/* Profile */}
                <IconButton
                  color="inherit"
                  onClick={() => navigate('/profile')}
                >
                  <Person />
                </IconButton>
              </>
            ) : (
              <>
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

                {/* Auth Buttons */}
                <Button
                  color="inherit"
                  startIcon={<Login />}
                  onClick={() => {
                    setAuthTab(0);
                    setAuthDialog(true);
                  }}
                  sx={{ mr: 1 }}
                >
                  {!isMobile && 'Войти'}
                </Button>

                <Button
                  variant="outlined"
                  startIcon={<Store />}
                  onClick={() => {
                    setAuthTab(1);
                    setRegisterData(prev => ({ ...prev, role: 'partner' }));
                    setAuthDialog(true);
                  }}
                  sx={{
                    mr: 1,
                    borderColor: 'rgba(255, 255, 255, 0.3)',
                    color: 'white',
                    '&:hover': {
                      borderColor: 'white',
                      backgroundColor: 'rgba(255, 255, 255, 0.1)',
                    }
                  }}
                >
                  {!isMobile && 'Продавец'}
                </Button>
              </>
            )}
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

      {/* Authentication Dialog */}
      <Dialog
        open={authDialog}
        onClose={() => setAuthDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle sx={{ textAlign: 'center', pb: 1 }}>
          {authTab === 0 ? '🚪 Вход в систему' : '📝 Регистрация'}
        </DialogTitle>
        <DialogContent>
          <Tabs
            value={authTab}
            onChange={(e, newValue) => setAuthTab(newValue)}
            variant="fullWidth"
            sx={{ mb: 3 }}
          >
            <Tab label="Войти" />
            <Tab label="Регистрация" />
          </Tabs>

          {authTab === 0 ? (
            // Login Tab
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={loginData.email}
                onChange={(e) => setLoginData(prev => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={loginData.password}
                onChange={(e) => setLoginData(prev => ({ ...prev, password: e.target.value }))}
              />
              <TextField
                fullWidth
                select
                label="Роль"
                value={loginData.role}
                onChange={(e) => setLoginData(prev => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="user">👤 Покупатель</MenuItem>
                <MenuItem value="partner">🏪 Продавец</MenuItem>
              </TextField>
            </Box>
          ) : (
            // Register Tab
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Имя"
                    value={registerData.firstName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, firstName: e.target.value }))}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Фамилия"
                    value={registerData.lastName}
                    onChange={(e) => setRegisterData(prev => ({ ...prev, lastName: e.target.value }))}
                  />
                </Grid>
              </Grid>
              <TextField
                fullWidth
                label="Email"
                type="email"
                value={registerData.email}
                onChange={(e) => setRegisterData(prev => ({ ...prev, email: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Телефон"
                value={registerData.phone}
                onChange={(e) => setRegisterData(prev => ({ ...prev, phone: e.target.value }))}
              />
              <TextField
                fullWidth
                select
                label="Тип аккаунта"
                value={registerData.role}
                onChange={(e) => setRegisterData(prev => ({ ...prev, role: e.target.value }))}
              >
                <MenuItem value="user">👤 Покупатель</MenuItem>
                <MenuItem value="partner">🏪 Продавец</MenuItem>
              </TextField>
              <TextField
                fullWidth
                label="Пароль"
                type="password"
                value={registerData.password}
                onChange={(e) => setRegisterData(prev => ({ ...prev, password: e.target.value }))}
              />
              <TextField
                fullWidth
                label="Подтвердите пароль"
                type="password"
                value={registerData.confirmPassword}
                onChange={(e) => setRegisterData(prev => ({ ...prev, confirmPassword: e.target.value }))}
              />

              {registerData.role === 'partner' && (
                <Alert severity="info" sx={{ mt: 1 }}>
                  Для регистрации продавца потребуется верификация документов и бизнес-информации.
                </Alert>
              )}
            </Box>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setAuthDialog(false)}>
            Отмена
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              // Mock authentication - in real app would call API
              if (authTab === 0) {
                // Mock login success
                alert(`Вход выполнен как ${loginData.role === 'partner' ? 'продавец' : 'покупатель'}`);
              } else {
                // Mock registration success
                alert(`Регистрация выполнена как ${registerData.role === 'partner' ? 'продавец' : 'покупатель'}`);
              }
              setAuthDialog(false);
            }}
          >
            {authTab === 0 ? 'Войти' : 'Зарегистрироваться'}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default Navigation
