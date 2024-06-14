import React from 'react';
import { Container, Typography, Box, Button } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
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

const OrderConfirmationPage = () => {
  const navigate = useNavigate();

  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            Спасибо за ваш заказ!
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Ваш заказ был успешно оформлен. Вы получите электронное письмо с подтверждением и деталями вашего заказа.
          </Typography>
        </Box>
        <Box textAlign="center" mt={4}>
          <GradientButton variant="contained" onClick={handleBackToCatalog}>
            Вернуться в каталог
          </GradientButton>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default OrderConfirmationPage;
