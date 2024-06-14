import React, { useState, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Container, Grid, Typography, Button, Card, CardContent, CardMedia, Box } from '@mui/material';
import axios from './axios';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#f50057',
    },
  },
  typography: {
    h3: {
      fontWeight: 'bold',
      textTransform: 'uppercase',
      letterSpacing: '0.1em',
      animation: 'fadeIn 1.5s ease-in-out',
    },
  },
  components: {
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 10px 20px rgba(0, 0, 0, 0.2)',
          borderRadius: 16,
          transition: 'transform 0.3s, box-shadow 0.3s',
          '&:hover': {
            transform: 'translateY(-10px)',
            boxShadow: '0 15px 25px rgba(0, 0, 0, 0.3)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
          borderRadius: 16,
          color: 'white',
          height: 48,
          padding: '0 30px',
          boxShadow: '0 3px 5px 2px rgba(255, 105, 135, .3)',
          '&:hover': {
            background: 'linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)',
          },
        },
      },
    },
  },
});

const HomePage = () => {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/product');
      setProducts(response.data.slice(0, 4));
    };

    fetchProducts();
  }, []);

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            Добро пожаловать в наш магазин!
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Лучшие предложения
          </Typography>
        </Box>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card>
                <CardMedia
                  component="img"
                  alt={product.name}
                  height="250"
                  image={product.image_url}
                />
                <CardContent>
                  <Typography gutterBottom variant="h6" component="div">
                    {product.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ${product.price}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <Box textAlign="center" m={4}>
          <Button variant="contained" href="/register" size="large">
            Перейти к регистрации
          </Button>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default HomePage;
