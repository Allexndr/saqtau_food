import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import { ThemeProvider } from '@mui/material/styles'
import { CssBaseline } from '@mui/material'
import { lightTheme } from './utils/theme'
import { CartProvider } from './hooks/useCart'
import './utils/i18n'
import './index.css'
import App from './App.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={lightTheme}>
      <CssBaseline />
      <CartProvider>
        <BrowserRouter>
    <App />
        </BrowserRouter>
      </CartProvider>
    </ThemeProvider>
  </StrictMode>,
)
