import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

type MenuContext = {
  hiddenFiles: boolean;
  setHiddenFiles: (hideFiles: boolean) => void;
};
const menuContext = createContext<MenuContext>({
  hiddenFiles: false,
  setHiddenFiles: () => {},
});

type MenuContextProviderProps = {
  children: React.ReactNode;
};
export const MenuContextProvider = ({ children }: MenuContextProviderProps) => {
  const [hiddenFiles, setHiddenFiles] = useState(false);

  const hiddenFileChangeHandler: MenuContext["setHiddenFiles"] = useCallback(
    (hideFiles) => {
      setHiddenFiles(hideFiles);
    },
    []
  );
  const menuValue: MenuContext = useMemo(
    () => ({ hiddenFiles, setHiddenFiles: hiddenFileChangeHandler }),
    [hiddenFileChangeHandler, hiddenFiles]
  );
  return (
    <menuContext.Provider value={menuValue}>{children}</menuContext.Provider>
  );
};

export const useMenuContext = () => useContext(menuContext);
