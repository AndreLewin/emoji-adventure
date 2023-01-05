import { type NextPage } from "next";
import ToolSelector from "../components/selectors/ToolSelector";
import ColorSelector from "../components/selectors/ColorSelector";
import EmojiSelector from "../components/selectors/EmojiSelector";
import Grid from "../components/Grid";
import EmojiPicker from "../components/selectors/EmojiPicker";
import GridInfo from "../components/GridInfo";

const Home: NextPage = () => {

  return (
    <>
      <ToolSelector />
      <div style={{ display: "flex" }}>
        <ColorSelector />
        <EmojiSelector />
      </div>
      <div style={{ display: "flex" }}>
        <Grid />
        <EmojiPicker />
      </div>
      <GridInfo />
    </>
  );
};

export default Home;