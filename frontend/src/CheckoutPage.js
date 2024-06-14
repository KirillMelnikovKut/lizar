import React from 'react';
import { Container, Typography, Box, TextField, Button, Grid } from '@mui/material';
import { styled } from '@mui/system';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: '1.5rem',
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          height: 48,
          padding: '0 30px',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          transition: 'background 0.3s ease',
        },
      },
    },
  },
});

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  color: 'white',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
  },
}));

const CheckoutPage = () => {
  const navigate = useNavigate();

  const handlePayment = (e) => {
    e.preventDefault();
    console.log('Оплата проведена');
    navigate('/order-confirmation'); 
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            Оплата
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Пожалуйста, введите ваши данные для оплаты.
          </Typography>
        </Box>
        <Box component="form" onSubmit={handlePayment} maxWidth="sm" mx="auto">
          <TextField
            fullWidth
            variant="outlined"
            label="Имя на карте"
            required
          />
          <TextField
            fullWidth
            variant="outlined"
            label="Номер карты"
            required
          />
          <Grid container spacing={2}>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="Срок действия"
                placeholder="MM/YY"
                required
              />
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                variant="outlined"
                label="CVC"
                required
              />
            </Grid>
          </Grid>
          <Box textAlign="center" mt={4}>
            <GradientButton type="submit" variant="contained" size="large">
              Оплатить
            </GradientButton>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CheckoutPage;
