import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useLocation } from "react-router-dom";

type SearchContext = {
  search: string;
  setSearch: (searchValue: string) => void;
  resetSearch: () => void;
};
const searchContext = createContext<SearchContext>({
  search: "",
  resetSearch: () => {},
  setSearch: () => {},
});

export const SearchContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [searchString, setSearchString] = useState("");
  const setNewSearchString: SearchContext["setSearch"] = useCallback(
    (newString) => {
      setSearchString(newString);
    },
    []
  );
  const { pathname } = useLocation();
  // const removeCharacter = () => {
  //   setSearchString((prev) => prev.slice(0, prev.length - 1));
  // };
  const resetSearch: SearchContext["resetSearch"] = useCallback(() => {
    setSearchString("");
  }, []);

  useEffect(() => {
    resetSearch();
  }, [pathname, resetSearch]);
  const searchContextValue: SearchContext = useMemo(
    () => ({
      search: searchString,
      resetSearch,
      setSearch: setNewSearchString,
    }),
    [resetSearch, searchString, setNewSearchString]
  );

  return (
    <searchContext.Provider value={searchContextValue}>
      {children}
    </searchContext.Provider>
  );
};
export const useSearchContext = () => useContext(searchContext);
