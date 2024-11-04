import { useEffect } from "react";
import { ThemeOptions, ThemeProvider, createTheme } from "@mui/material";
import Router from "./Router";
import {
  generateMuiThemeColors,
  generateCssVariablesStyle,
} from "./styles/variables";

const theme: ThemeOptions = createTheme({
  palette: generateMuiThemeColors(),
});
function App() {
  useEffect(() => {
    const styleElement = document.createElement("style");
    styleElement.innerHTML = generateCssVariablesStyle();
    document.head.appendChild(styleElement);
    return () => {
      document.head.removeChild(styleElement);
    };
  }, []);
  return (
    <ThemeProvider theme={theme}>
      <Router />
    </ThemeProvider>
  );
}

export default App;
