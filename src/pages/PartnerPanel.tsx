import {
  Box,
  Typography,
  Container,
  Grid,
  Card,
  CardContent,
  Chip,
  Button,
} from '@mui/material'
import { useTranslation } from 'react-i18next'
import { DataGrid, GridColDef } from '@mui/x-data-grid'
import { LineChart } from '@mui/x-charts/LineChart'
import { mockProducts, mockPartners } from '../utils/mockData'

const PartnerPanel = () => {
  const { t } = useTranslation()

  const partner = mockPartners[0]
  const partnerProducts = mockProducts.filter((p) => p.partnerId === partner.id)

  const ordersData = [5, 12, 18, 25, 32, 40, 55]
  const savedKgData = [10, 22, 35, 50, 70, 90, 120]

  const columns: GridColDef[] = [
    { field: 'title', headerName: 'Пакет', flex: 1, minWidth: 160 },
    { field: 'category', headerName: 'Категория', width: 110 },
    {
      field: 'discountPrice',
      headerName: 'Цена',
      width: 110,
      valueFormatter: (params) => `${params.value.toLocaleString()} ₸`,
    },
    { field: 'quantity', headerName: 'Остаток', width: 100 },
    {
      field: 'discountPercentage',
      headerName: 'Скидка',
      width: 90,
      valueFormatter: (params) => `-${params.value}%`,
    },
  ]

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography variant="h4" component="h1" sx={{ fontWeight: 700, mb: 1 }}>
            Панель партнёра
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Управляйте своими «магическими пакетами», следите за статистикой и выручкой.
          </Typography>
        </Box>
        <Button variant="contained" size="large" sx={{ borderRadius: 3 }}>
          Создать новый пакет
        </Button>
      </Box>

      <Grid container spacing={3}>
        {/* Partner summary */}
        <Grid item xs={12} md={4}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 1 }}>
                {partner.name}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                {partner.description}
              </Typography>
              <Chip
                label={partner.isVerified ? 'Проверенный партнёр' : 'На модерации'}
                color={partner.isVerified ? 'success' : 'warning'}
                sx={{ mb: 2 }}
              />
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Город:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner.location.city}
                </Typography>
              </Box>
              <Box sx={{ mb: 1 }}>
                <Typography variant="body2" sx={{ fontWeight: 600 }}>
                  Рейтинг:
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {partner.rating} ⭐ ({partner.reviewCount} отзывов)
                </Typography>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        {/* Charts */}
        <Grid item xs={12} md={8}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Динамика заказов и спасённой еды
              </Typography>
              <LineChart
                height={260}
                series={[
                  { data: ordersData, label: 'Заказы', color: '#2196F3' },
                  { data: savedKgData, label: 'Спасено кг', color: '#4CAF50' },
                ]}
                xAxis={[{ scaleType: 'point', data: ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'] }]}
                margin={{ left: 40, right: 20, top: 20, bottom: 20 }}
              />
            </CardContent>
          </Card>
        </Grid>

        {/* Products table */}
        <Grid item xs={12}>
          <Card sx={{ borderRadius: 3 }}>
            <CardContent sx={{ height: 400 }}>
              <Typography variant="h6" sx={{ fontWeight: 600, mb: 2 }}>
                Ваши активные «магические пакеты»
              </Typography>
              <DataGrid
                rows={partnerProducts}
                columns={columns}
                getRowId={(row) => row.id}
                disableRowSelectionOnClick
                pageSizeOptions={[5, 10]}
                initialState={{
                  pagination: { paginationModel: { pageSize: 5, page: 0 } },
                }}
              />
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </Container>
  )
}

export default PartnerPanel

