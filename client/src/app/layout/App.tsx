import { useEffect, useState } from "react";
import { Container, CssBaseline, createTheme, ThemeProvider, Typography} from "@mui/material";
import Header from "./Header";
import { Outlet } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useStoreContext } from "../context/StoreContext";
import { getCookie } from "../util/util";
import agent from "../api/agent";
import LoadingComponent from "./LoadingComponent";

export default function App() {
  const {setBasket} = useStoreContext(); // Destructuring
  const [loading, setLoading] = useState(true);

  useEffect( () =>{                       // Set basket
    const buyerId = getCookie('buyerId');
    if (buyerId) {
      agent.Basket.get()
        .then(basket => setBasket(basket))
        .catch(error => console.log(error))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, [setBasket]) // setBasket is technically not necessary

  const [darkMode, setDarkMode] = useState(false);
  const paletteType = darkMode? 'dark' : 'light';
  const theme = createTheme(
    {
      palette: {
        mode: paletteType,
        background: {
          default: paletteType === 'light'? '#eaeaea' : '#121212'
        }
      }
    }
  )
  
  function handleThemeChange() {
    setDarkMode(!darkMode);
  }

  if (loading) return <LoadingComponent message="Initializing..."></LoadingComponent>

  return (
    <ThemeProvider theme={theme}>
      <ToastContainer position="bottom-right" hideProgressBar theme="colored" />
      <CssBaseline />
      <Header darkMode={darkMode} handleThemeChange={handleThemeChange}/>
      <Container>
        <Outlet />
      </Container>
    </ThemeProvider>
  );
}


