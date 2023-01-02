import { type NextPage } from "next";
import Grid from "../components/Grid";
import ColorSelector from "../components/selectors/ColorSelector";

const Home: NextPage = () => {

  return (
    <>
      <Grid />
      <ColorSelector />
    </>
  );
};

export default Home;