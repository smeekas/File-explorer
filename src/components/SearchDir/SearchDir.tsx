import { Input } from "@mui/material";
import { useSearchContext } from "../../context/SearchContext";
import SearchIcon from "@mui/icons-material/Search";

function SearchDir() {
  const { setSearch, search } = useSearchContext();
  return (
    <Input
      placeholder="search"
      onChange={(e) => setSearch(e.target.value)}
      value={search}
      endAdornment={<SearchIcon />}
    />
  );
}

export default SearchDir;
