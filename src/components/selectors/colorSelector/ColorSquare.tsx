const ColorSquare: React.FC<{ color: string }> = ({ color }) => {

  return (
    <>
      <div className="colorChoice" style={{ backgroundColor: color }} />
      <style jsx>
        {`
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

export default ColorSquare