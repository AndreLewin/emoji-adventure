import { type NextPage } from "next";
import Grid from "../components/Grid";
import ColorSelector from "../components/ColorSelector";

const Home: NextPage = () => {

  return (
    <>
      <Grid />
      <ColorSelector />
    </>
  );
};

export default Home;