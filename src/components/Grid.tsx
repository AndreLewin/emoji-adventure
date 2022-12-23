const Grid: React.FC<{}> = ({ }) => {

  const cells = (new Array(100)).fill("")

  return (
    <div className="container">
      {cells.map((c, index) => <div key={`${index}`}>{index}</div>)}
      <style jsx>
        {`
          .container {
            display: grid;
            grid-template-columns: repeat(10, 40px);
            grid-auto-rows: 40px;
            outline: 0.5px solid;
            outline-color: rgba(50, 115, 220, 0.1);
            width: fit-content;
          }

          .container > * {
            outline: 0.5px solid;
            outline-color: rgba(50, 115, 220, 0.1);
          }
        `}
      </style>
    </div>
  )
}

export default Grid