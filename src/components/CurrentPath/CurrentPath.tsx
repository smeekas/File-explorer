import { useLocation, useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import useHomeDir from "../../hooks/useHomeDir";
import HomeIcon from "@mui/icons-material/Home";
import { Skeleton } from "@mui/material";
import { PathType } from "../../types/currentPath.types";
import { CurrentPathStyled, LinkStyled } from "./CurrentPath.styled";
import { FILES_ROUTE } from "../../utils/constants";

function CurrentPath() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { homeDir, loading } = useHomeDir();

  const paths: PathType[] = [];
  if (loading) return <Skeleton />;
  if (pathname === `/`) {
    paths.push({ label: <HomeIcon />, path: "/" });
  } else {
    const splitted = pathname.slice(FILES_ROUTE.length + 1).split(homeDir);
    splitted.shift();
    const ans = splitted[0]
      .split("/")
      .map((item) => decodeURIComponent(item))
      .reduce<PathType[]>((acc, curr, index) => {
        if (index == 0) {
          acc.push({ label: <HomeIcon fontSize="small" />, path: homeDir });
        } else {
          acc.push({ label: curr, path: `${acc[index - 1].path}/${curr}` });
        }
        return acc;
      }, []);
    paths.push(...ans);
  }

  return (
    <CurrentPathStyled
      separator={<ArrowForwardIosIcon fontSize="small" />}
      maxItems={4}
    >
      {paths.map((pathItem) => {
        return (
          <LinkStyled
            href={`/${FILES_ROUTE}${pathItem.path}`}
            onClick={(e) => {
              e.preventDefault();
              navigate(`/${FILES_ROUTE}${pathItem.path}`);
            }}
            key={pathItem.path}
            underline="hover"
          >
            {pathItem.label}
          </LinkStyled>
        );
      })}
    </CurrentPathStyled>
  );
}

export default CurrentPath;
