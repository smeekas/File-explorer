import { Outlet } from "react-router-dom";
import { ContentStyled, LayoutStyled, MainStyled } from "./Layout.styled";

import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import Controls from "../Controls/Controls";
import useCheckMonitor from "../../hooks/useCheckMonitor";

function Layout() {
  const isMonitor = useCheckMonitor();
  return (
    <LayoutStyled>
      <div className="sticky-header">
        <Header />
        {!isMonitor && <Controls />}
      </div>
      <MainStyled>
        <Sidebar />
        <ContentStyled>
          <Outlet />
        </ContentStyled>
      </MainStyled>
    </LayoutStyled>
  );
}

export default Layout;
