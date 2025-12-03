import {
  Box,
  TextField,
  InputAdornment,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Typography,
  ToggleButton,
  ToggleButtonGroup,
  useTheme,
} from '@mui/material'
import { Search, Tune } from '@mui/icons-material'
import type { Dispatch, SetStateAction } from 'react'

export interface MapFiltersState {
  search: string
  category: 'all' | 'food' | 'fashion'
  maxDistance: number
}

interface MapFiltersProps {
  filters: MapFiltersState
  setFilters: Dispatch<SetStateAction<MapFiltersState>>
  showDistance?: boolean
}

const MapFilters = ({ filters, setFilters, showDistance = true }: MapFiltersProps) => {
  const theme = useTheme()

  return (
    <Box sx={{ p: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
        <Tune sx={{ fontSize: 20, color: theme.palette.text.secondary }} />
        <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>
          Фильтры карты
        </Typography>
      </Box>

      <TextField
        fullWidth
        size="small"
        placeholder="Поиск по названию или партнеру"
        value={filters.search}
        onChange={(e) => setFilters((prev) => ({ ...prev, search: e.target.value }))}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <Search />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 2 }}
      />

      <Box sx={{ mb: 3 }}>
        <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
          Категория
        </Typography>
        <ToggleButtonGroup
          value={filters.category}
          exclusive
          fullWidth
          onChange={(_, value) => value && setFilters((prev) => ({ ...prev, category: value }))}
          size="small"
        >
          <ToggleButton value="all">Все</ToggleButton>
          <ToggleButton value="food">🍎 Еда</ToggleButton>
          <ToggleButton value="fashion">👕 Одежда</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      {showDistance && (
        <Box sx={{ mb: 2 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="distance-label">Радиус</InputLabel>
            <Select
              labelId="distance-label"
              label="Радиус"
              value={filters.maxDistance}
              onChange={(e) =>
                setFilters((prev) => ({ ...prev, maxDistance: Number(e.target.value) }))
              }
            >
              <MenuItem value={5}>до 5 км</MenuItem>
              <MenuItem value={10}>до 10 км</MenuItem>
              <MenuItem value={25}>до 25 км</MenuItem>
              <MenuItem value={50}>до 50 км</MenuItem>
              <MenuItem value={100}>до 100 км</MenuItem>
            </Select>
          </FormControl>
        </Box>
      )}
    </Box>
  )
}

export default MapFilters


