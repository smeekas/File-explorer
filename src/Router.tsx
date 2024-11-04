import { Routes, Route, HashRouter } from "react-router-dom";
import Home from "./Pages/Home/Home";
import DirectoryPage from "./Pages/Directory/DirectoryPage";
import Layout from "./components/Layout/Layout";
import { SearchContextProvider } from "./context/SearchContext";
import { MenuContextProvider } from "./context/MenuContext";
import Global from "./Opener/components/Global/Global";

function Router() {
  return (
    <HashRouter>
      <SearchContextProvider>
        <MenuContextProvider>
          <Routes>
            <Route path="/dirs-files" element={<Global />}>
              <Route index path="*" element={<h1>dF</h1>} />
            </Route>
            <Route path="/" element={<Layout />}>
              <Route index path="/" element={<Home />} />
              <Route index path="/*" element={<DirectoryPage />} />
            </Route>
          </Routes>
        </MenuContextProvider>
      </SearchContextProvider>
    </HashRouter>
  );
}
export default Router;
