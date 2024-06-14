import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { CssBaseline } from '@mui/material';
import HomePage from './HomePage';
import RegisterPage from './RegisterPage';
import LoginPage from './LoginPage';
import CatalogPage from './CatalogPage';
import ProductDetail from './ProductDetail';
import CartPage from './CartPage';
import CheckoutPage from './CheckoutPage';
import OrderConfirmationPage from './OrderConfirmationPage'; 
import OrderList from './OrderList';

const App = () => (
    <Router>
      <CssBaseline />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/catalog" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<CartPage />} />
        <Route path="/checkout" element={<CheckoutPage />} />
        <Route path="/order-confirmation" element={<OrderConfirmationPage />} /> 
        <Route path="/OrderList" element={<OrderList/>}/>
      </Routes>
    </Router>
);

ReactDOM.render(<App />, document.getElementById('root'));
