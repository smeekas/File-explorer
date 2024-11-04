import { Outlet } from "react-router-dom";
import { ContentStyled, LayoutStyled, MainStyled } from "./Layout.styled";

import Sidebar from "../SideBar/SideBar";
import Header from "../Header/Header";
import Controls from "../Controls/Controls";

function Layout() {
  return (
    <LayoutStyled>
      <div className="sticky-header">
        <Header />
        <Controls />
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
