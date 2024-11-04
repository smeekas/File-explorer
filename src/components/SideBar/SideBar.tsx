import { SideBarStyled } from "./SideBar.styled";
import { Events } from "../../utils/constants";
import useCommand from "../../hooks/useCommand";
import { FreeSpaceResult } from "../../types/freeSpace.types";
import PieChart from "../Charts/PieChart";

function SideBar() {
  const { data, loading } = useCommand<FreeSpaceResult>({
    eventKey: Events.FREE_SPACE,
    resultKey: Events.FREE_SPACE_RESULT,
  });

  return (
    <SideBarStyled>
      {loading && <p>loading....</p>}
      {!loading && data && (
        <div>
          <PieChart
            data={{
              datasets: [
                {
                  data: [
                    +(data.free / 1000).toFixed(2),
                    +(data.used / 1000).toFixed(2),
                  ],
                  animation: {
                    duration: 600,
                    easing: "linear",
                    delay: 100,
                  },
                },
              ],
              labels: ["Free Space", "Used Space"],
            }}
          />
        </div>
      )}
    </SideBarStyled>
  );
}

export default SideBar;
