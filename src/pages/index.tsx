import { type NextPage } from "next";
import Grid from "../components/Grid";
import ColorSelector from "../components/selectors/ColorSelector";
import ToolSelector from "../components/selectors/ToolSelector";

const Home: NextPage = () => {

  return (
    <>
      <ToolSelector />
      <ColorSelector />
      <Grid />
    </>
  );
};

export default Home;