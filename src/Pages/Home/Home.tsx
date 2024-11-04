import DataTable from "../../components/DataTable/DataTable";
import useGetDirectories from "../../hooks/useGetDirectories";
import useHomeDir from "../../hooks/useHomeDir";

function Home() {
  const { homeDir, loading } = useHomeDir();
  const { directories } = useGetDirectories(homeDir, !loading);
  return <DataTable data={directories} />;
}

export default Home;
