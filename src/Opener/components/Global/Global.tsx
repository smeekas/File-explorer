import { Outlet } from "react-router-dom";

function Global() {
  return (
    <div>
      Global
      <Outlet />
    </div>
  );
}

export default Global;
