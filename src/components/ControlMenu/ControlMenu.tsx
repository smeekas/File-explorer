import { Button, ListItemIcon, ListItemText, Menu } from "@mui/material";
import { useMenuContext } from "../../context/MenuContext";
import SettingsIcon from "@mui/icons-material/Settings";
import { useState } from "react";
import CheckIcon from "@mui/icons-material/Check";
import { MenuItemStyled } from "./ControlMenu.style";

function ControlMenu() {
  const { hiddenFiles, setHiddenFiles } = useMenuContext();
  const [isOpen, setIsOpen] = useState(false);
  const closeHandler = () => {
    setIsOpen(false);
  };
  return (
    <>
      <Button onClick={() => setIsOpen(true)} id="menu-btn">
        <SettingsIcon />
      </Button>
      <Menu
        open={isOpen}
        onClose={closeHandler}
        anchorEl={document.querySelector("#menu-btn")}
      >
        <MenuItemStyled
          onClick={() => (setHiddenFiles(!hiddenFiles), closeHandler())}
        >
          <ListItemText>Hidden Files</ListItemText>
          {hiddenFiles && (
            <ListItemIcon>
              <CheckIcon />
            </ListItemIcon>
          )}
        </MenuItemStyled>
      </Menu>
    </>
  );
}

export default ControlMenu;
