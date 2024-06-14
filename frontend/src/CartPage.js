import React, {useState, useEffect} from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Box, Grid, Button, IconButton, Stack } from '@mui/material';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from "./axios"

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
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: 16,
        },
      },
    },
  },
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 250,
  objectFit: 'contain',
}));

const GradientButton = styled(Button)(({ theme }) => ({
  background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
  borderRadius: 16,
  color: 'white',
  height: 48,
  padding: '0 30px',
  boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
  transition: 'background 0.3s ease',
  '&:hover': {
    background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
  },
}));

const CartPage = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState([])

  useEffect(()=>{
    axios.post("/getcart")
    .then((res)=>{
      setCart(res.data)
    })
  }, [])

  const handleRemoveFromCart = (id) => {
    
  };

  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  const handleProceedToCheckout = () => {
    navigate('/checkout');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            Корзина
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {cart.map((product, index) => (
            <Grid item key={index} xs={12} sm={6} md={3}>
              <Card>
                <StyledCardMedia
                  component="img"
                  alt={product.name}
                  image={product.image_url}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price}
                  </Typography>
                  <IconButton
                    aria-label="delete"
                    color="secondary"
                    onClick={() => handleRemoveFromCart(product.product_id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" mt={4}>
          <Stack direction="row" spacing={2} justifyContent="center">
            <GradientButton variant="contained" onClick={handleBackToCatalog}>
              Вернуться в каталог
            </GradientButton>
            <GradientButton variant="contained" onClick={handleProceedToCheckout}>
              Перейти к оплате
            </GradientButton>
          </Stack>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default CartPage;
