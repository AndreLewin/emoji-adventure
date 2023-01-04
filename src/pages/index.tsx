import { type NextPage } from "next";
import Grid from "../components/Grid";
import ToolSelector from "../components/selectors/ToolSelector";
import ColorSelector from "../components/selectors/ColorSelector";
import EmojiSelector from "../components/selectors/EmojiSelector";

const Home: NextPage = () => {

  return (
    <>
      <ToolSelector />
      <ColorSelector />
      <div style={{ display: "flex" }}>
        <Grid />
        <EmojiSelector />
      </div>
    </>
  );
};

export default Home;