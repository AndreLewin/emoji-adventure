import store from "../../store"
import EmojiSquare from "./emojiSelector/EmojiSquare"

const EmojiSelector: React.FC<{}> = ({ }) => {
  const lastEmojis = store(state => state.lastEmojis)

  return (
    <>
      <div className="container">
        <div className="lastEmojisContainer">
          {lastEmojis.map((e, i) => { return <EmojiSquare emoji={e} key={i} /> })}
        </div>
        <div className="extraSquares">
          <EmojiSquare emoji={""} />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            margin-left: 3px;
            display: flex;
          }
          .lastEmojisContainer {
            width: 328px;
            height: 64px;
            display: grid;
            gap: 2px 2px;
            grid-template-columns: repeat(10, 1fr)
          }
          .extraSquares {
            margin-left: 3px;
          }
        `}
      </style>
    </>
  )
}

export default EmojiSelector