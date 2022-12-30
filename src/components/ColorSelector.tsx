const ColorSelector: React.FC<{}> = ({ }) => {

  return (
    <>
      <div className="container">
        {[...Array(10)].map(() => { return <div className="colorChoice" /> })}
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

          .colorChoice {
            width: 30px;
            height: 30px;
            border: 1px solid rgba(160,160,160,1);
            padding: 2px 2px 2px 2px;
            /* make the effect of background-color begin only at after margin */
            /* https://developer.mozilla.org/en-US/docs/Web/CSS/background-clip */
            background-clip: content-box;
            background-color: rgba(0,0,0,1);
          }
        `}
      </style>
    </>
  )
}

export default ColorSelector