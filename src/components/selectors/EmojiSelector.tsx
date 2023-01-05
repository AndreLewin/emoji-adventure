import store from "../../store"
import EmojiSquare from "./emojiSelector/EmojiSquare"

const EmojiSelector: React.FC<{}> = ({ }) => {
  const lastEmojis = store(state => state.lastEmojis)

  return (
    <>
      <div className="container">
        {lastEmojis.map((e, i) => { return <EmojiSquare emoji={e} key={i} /> })}
      </div>
      <style jsx>
        {`
          .container {
            width: 328px;
            height: 64px;
            display: grid;
            gap: 2px 2px;
            grid-template-columns: repeat(10, 1fr)
          }
        `}
      </style>
    </>
  )
}

export default EmojiSelector