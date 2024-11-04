import useCommand from "../../hooks/useCommand";
import { Events } from "../../utils/constants";

type ImageProps = {
  path: string;
};
function Image({ path }: ImageProps) {
  const { data, loading } = useCommand<string>({
    eventKey: Events.GET_IMAGE,
    resultKey: Events.GET_IMAGE_RESULT,
    reqBody: path,
  });
  if (loading) {
    return <p>L</p>;
  }
  if (data) {
    return <img src={data} />;
  }
}

export default Image;
