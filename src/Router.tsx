import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import DirectoryPage from "./Pages/Directory/DirectoryPage";
import Layout from "./components/Layout/Layout";
import { SearchContextProvider } from "./context/SearchContext";
import { MenuContextProvider } from "./context/MenuContext";
import { FILES_ROUTE } from "./utils/constants";
import Monitor from "./components/Monitor/Monitor";

function Router() {
  return (
    <HashRouter>
      <SearchContextProvider>
        <MenuContextProvider>
          <Routes>
            {/* <Route
              path="/"
              element={<Navigate to={`/${FILES_ROUTE}`} replace />}
            /> */}
            <Route path={`/`} element={<Layout />}>
              <Route index path={`/`} element={<Home />} />
              <Route
                index
                path={`/${FILES_ROUTE}/*`}
                element={<DirectoryPage />}
              />
            </Route>
            <Route path="/monitor" element={<Monitor />} />
          </Routes>
        </MenuContextProvider>
      </SearchContextProvider>
    </HashRouter>
  );
}
export default Router;
