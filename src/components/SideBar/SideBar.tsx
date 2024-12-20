import { SideBarStyled } from './SideBar.styled';
import { Events } from '../../utils/constants';
import useCommand from '../../hooks/useCommand';
import { FreeSpaceResult } from '../../types/freeSpace.types';

function SideBar() {
  const { data, loading } = useCommand<FreeSpaceResult>({
    eventKey: Events.FREE_SPACE,
    resultKey: Events.FREE_SPACE_RESULT,
  });

  return (
    <SideBarStyled>
      {loading && <p>loading....</p>}
      {JSON.stringify(data, null, 2)}
    </SideBarStyled>
  );
}

export default SideBar;
