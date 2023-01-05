import ColorSquare from "./colorSelector/ColorSquare"

const colors: string[] = [
  "rgb(0,0,0)",
  "rgb(127,127,127)",
  "rgb(136,0,21)",
  "rgb(237,28,36)",
  "rgb(255,127,39)",
  "rgb(255,242,0)",
  "rgb(34,177,76)",
  "rgb(0,162,232)",
  "rgb(63,72,204)",
  "rgb(163,73,164)",
  "rgb(255,255,255)",
  "rgb(195,195,195)",
  "rgb(185,122,87)",
  "rgb(255,174,201)",
  "rgb(255,201,14)",
  "rgb(239,228,176)",
  "rgb(181,230,29)",
  "rgb(153,217,234)",
  "rgb(112,146,190)",
  "rgb(200,191,231)"
]

const ColorSelector: React.FC<{}> = ({ }) => {

  return (
    <>
      <div className="container">
        <div className="presetColorsContainer">
          {colors.map((c, i) => { return <ColorSquare color={c} key={i} /> })}
        </div>
        <div className="extraSquares">
          <ColorSquare color={""} />
        </div>
      </div>
      <style jsx>
        {`
          .container {
            display: flex;
          }
          .presetColorsContainer {
            width: 328px;
            height: 64px;
            display: grid;
            gap: 2px 2px;
            grid-template-columns: repeat(10, 1fr)
          }
          .extraSquares {
            margin-left: 2px;
          }
        `}
      </style>
    </>
  )
}

export default ColorSelector