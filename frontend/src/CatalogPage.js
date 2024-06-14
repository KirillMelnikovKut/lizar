import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Card, CardContent, Button, IconButton, CardMedia, Box } from '@mui/material';
import { styled } from '@mui/system';
import axios from './axios';
import { createTheme, ThemeProvider } from '@mui/material/styles';

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
          cursor: 'pointer',
        },
      },
    },
  },
});

const StyledCardMedia = styled(CardMedia)(({ theme }) => ({
  height: 250,
  objectFit: 'contain',
}));

const AnimatedTitle = styled(Typography)(({ theme }) => ({
  color: theme.palette.primary.main,
  textTransform: 'uppercase',
  fontWeight: 'bold',
  letterSpacing: '0.1em',
  marginBottom: theme.spacing(4),
  animation: 'fadeIn 1.5s ease-in-out',
  '@keyframes fadeIn': {
    '0%': { opacity: 0, transform: 'translateY(-20px)' },
    '100%': { opacity: 1, transform: 'translateY(0)' },
  },
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
const CatalogPage = () => {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      const response = await axios.get('/product');
      setProducts(response.data);
    };

    fetchProducts();
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  const handleExit = () => {
    localStorage.removeItem("tokem")
    navigate("/login")
  }
  const handleBackToCatalog = () => {
    navigate('/catalog');
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <AnimatedTitle variant="h3">
            Каталог товаров
          </AnimatedTitle>
        </Box>
        <GradientButton className="Btn" variant="contained" onClick={handleBackToCatalog}>
              Мои заказы
        </GradientButton>
        <Grid container spacing={4}>
          {products.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={3}>
              <Card onClick={() => handleProductClick(product.product_id)}>
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
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
        <div style={{marginTop:"16px", marginBottom:"16px", display: "flex", justifyContent: "end"}}>
          <button style={{width:"100px", height: "32px", display:"flex", justifyContent:"center", alignItems:"center", border: "2px solid black", borderRadius: "8px"}} onClick={handleExit}>Выйти</button>
        </div>
      </Container>
    </ThemeProvider>
  );
};

export default CatalogPage;
