import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Grid,
} from "@mui/material";
import { styled } from "@mui/system";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import axios from "./axios.js";

const theme = createTheme({
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#f50057",
    },
  },
  typography: {
    h3: {
      fontWeight: "bold",
      textTransform: "uppercase",
      letterSpacing: "0.1em",
      animation: "fadeIn 1.5s ease-in-out",
    },
  },
  components: {
    MuiTextField: {
      styleOverrides: {
        root: {
          marginBottom: "1.5rem",
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          background: "linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)",
          borderRadius: 16,
          color: "white",
          height: 48,
          padding: "0 30px",
          boxShadow: "0 3px 5px 2px rgba(255, 105, 135, .3)",
          "&:hover": {
            background: "linear-gradient(45deg, #FE6B8B 40%, #FF8E53 100%)",
          },
        },
      },
    },
  },
});

const FormContainer = styled(Box)(({ theme }) => ({
  backgroundColor: "white",
  padding: theme.spacing(5),
  borderRadius: theme.shape.borderRadius * 2,
  boxShadow: "0 10px 20px rgba(0, 0, 0, 0.2)",
  maxWidth: 500,
  margin: "0 auto",
  marginTop: theme.spacing(5),
}));

const RegisterPage = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const navigate = useNavigate();

  const handleRegister = (e) => {
    e.preventDefault();
    axios
      .post("/register", { name: name, email: email, password: password })
      .then((res) => {
        localStorage.setItem("token", res.data.token);
        navigate("/catalog");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <ThemeProvider theme={theme}>
      <Container>
        <Box textAlign="center" mt={5} mb={5}>
          <Typography variant="h3" gutterBottom>
            Регистрация
          </Typography>
          <Typography variant="h5" color="textSecondary">
            Создайте новый аккаунт
          </Typography>
        </Box>
        <FormContainer>
          <form onSubmit={handleRegister}>
            <TextField
              variant="outlined"
              fullWidth
              label="Имя"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Электронная почта"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <TextField
              variant="outlined"
              fullWidth
              label="Пароль"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Box textAlign="center" mt={4}>
              <Button type="submit" variant="contained" size="large">
                Зарегистрироваться
              </Button>
            </Box>
          </form>
          <Box textAlign="center" mt={2}>
            <Button variant="text" href="/login">
              Уже есть аккаунт? Войти
            </Button>
          </Box>
        </FormContainer>
      </Container>
    </ThemeProvider>
  );
};

export default RegisterPage;
