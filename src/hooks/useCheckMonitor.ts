import { useLocation } from "react-router-dom";

function useCheckMonitor() {
  const { pathname } = useLocation();
  const isMonitor = pathname.startsWith("/monitor");
  return isMonitor;
}

export default useCheckMonitor;
