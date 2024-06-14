import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Container, Typography, Card, CardContent, CardMedia, Box, Button, Stack } from '@mui/material';
import axios from './axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { styled } from '@mui/system';

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
  height: 500,
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

const OutlineButton = styled(Button)(({ theme }) => ({
  borderRadius: 16,
  color: theme.palette.secondary.main,
  borderColor: theme.palette.secondary.main,
  height: 48,
  padding: '0 30px',
  transition: 'background 0.3s ease, color 0.3s ease',
  '&:hover': {
    backgroundColor: theme.palette.secondary.main,
    color: 'white',
  },
}));

const ProductDetail = () => {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`/product?product_id=${id}`);
        setProduct(response.data[0]);
      } catch (error) {
        console.error('Failed to fetch product:', error);
      }
    };

    const checkIfInCart = async () => {
      try {
        const response = await axios.get(`/incart?product_id=${id}`);
        setAdded(response.data.added);
      } catch (error) {
        console.error('Failed to check if product is in cart:', error);
      }
    };

    fetchProduct();
    checkIfInCart();
  }, [id]);

  const handleDeleteFromCart = async () => {
    try {
      await axios.post("remove-from-cart", { product_id: id });
      setAdded(false);
    } catch (error) {
      console.error('Failed to remove product from cart:', error);
    }
  };

  const handleAddToCart = async () => {
    try {
      await axios.post("add-to-cart", { product_id: id });
      setAdded(true);
    } catch (error) {
      console.error('Failed to add product to cart:', error);
    }
  };

  const handleClose = () => {
    navigate('/catalog');
  };

  if (!product) {
    return <div>Loading...</div>;
  }

  const handleCart = () =>{
    navigate("/cart")
  }

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            {product.name}
          </Typography>
        </Box>
        <Card>
          <StyledCardMedia
            component="img"
            alt={product.name}
            image={product.image_url}
          />
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              ${product.price}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {product.description}
            </Typography>
            <Stack direction="row" spacing={2} justifyContent="center" mt={4}>
              {added ? (
                <GradientButton variant="contained" onClick={handleDeleteFromCart}>
                  Удалить из корзины
                </GradientButton>
              ) : (
                <GradientButton variant="contained" onClick={handleAddToCart}>
                  Добавить в корзину
                </GradientButton>
              )}
              <OutlineButton variant="outlined" onClick={handleClose}>
                Закрыть
              </OutlineButton>
              <OutlineButton variant="outlined" onClick={handleCart}>
                Перейти в корзину
              </OutlineButton>
            </Stack>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
};

export default ProductDetail;
