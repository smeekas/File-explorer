import { useLocation } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import useGetDirectories from "../../hooks/useGetDirectories";

function Directory() {
  const { pathname } = useLocation();
  const { directories } = useGetDirectories(decodeURIComponent(pathname));
  return <DataTable data={directories} />;
}

export default Directory;
