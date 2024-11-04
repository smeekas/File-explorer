import { ButtonGroup, Button, Tooltip } from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { HeaderStyled } from "./Header.styled";
import SearchDir from "../SearchDir/SearchDir";
import { useNavigate } from "react-router-dom";

function Header() {
  const navigate = useNavigate();
  const goPrevious = () => {
    navigate(-1);
  };
  const goForward = () => {
    navigate(1);
  };
  return (
    <HeaderStyled>
      <ButtonGroup size="small">
        <Tooltip title="go back">
          <Button variant="text" onClick={goPrevious}>
            <ArrowBackIcon />
          </Button>
        </Tooltip>
        <Tooltip title="go forward">
          <Button variant="text" onClick={goForward}>
            <ArrowForwardIcon />
          </Button>
        </Tooltip>
      </ButtonGroup>

      <SearchDir />
    </HeaderStyled>
  );
}

export default Header;
