import { useLocation } from "react-router-dom";
import DataTable from "../../components/DataTable/DataTable";
import useGetDirectories from "../../hooks/useGetDirectories";
import { FILES_ROUTE } from "../../utils/constants";

function Directory() {
  const { pathname } = useLocation();
  // console.log(
  //   pathname.includes(FILES_ROUTE)
  //     ? pathname.slice(FILES_ROUTE.length + 1)
  //     : pathname
  // );

  const { directories } = useGetDirectories(
    decodeURIComponent(
      pathname.includes(FILES_ROUTE)
        ? pathname.slice(FILES_ROUTE.length + 1)
        : pathname
    )
  );
  return <DataTable data={directories} />;
}

export default Directory;
