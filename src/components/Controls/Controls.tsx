import { ControlStyled } from "./Controls.styled";
import CurrentPath from "../CurrentPath/CurrentPath";

import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import Checkbox from "@mui/material/Checkbox";
import { useMenuContext } from "../../context/MenuContext";
import { MenuItem, Select, Tooltip } from "@mui/material";
import { View } from "../../types/controls.types";
import { Link } from "react-router-dom";
function Controls() {
  const { hiddenFiles, setHiddenFiles } = useMenuContext();
  return (
    <ControlStyled>
      <CurrentPath />
      <div>
        <Link to={"/monitor"}>Monitor</Link>
        <Tooltip
          title={hiddenFiles ? "Don't Show Hidden Files" : "Show Hidden Files"}
        >
          <Checkbox
            checked={hiddenFiles}
            onChange={(_, status) => setHiddenFiles(status)}
            icon={<VisibilityIcon />}
            checkedIcon={<VisibilityOffIcon />}
          />
        </Tooltip>
        <Select defaultValue={View.List} size="small">
          <MenuItem value={View.List}>List</MenuItem>
          <MenuItem value={View.Grid}>Grid</MenuItem>
        </Select>
      </div>
    </ControlStyled>
  );
}

export default Controls;
