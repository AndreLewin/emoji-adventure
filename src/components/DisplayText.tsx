import store from "../store";

const DisplayText: React.FC<{}> = ({ }) => {
  const text1 = store(state => state.text1)
  const text2 = store(state => state.text2)
  const text3 = store(state => state.text3)

  const variables = store(state => state.variables)
  const subs = store(state => state.subs)
  const configs = store(state => state.configs)

  return (
    <>
      <div className="container">
        <div className="text1">
          {text1}
        </div>
        <div className="text2">
          {text2}
        </div>
        <div className="text3">
          {text3}
          --
          {JSON.stringify(variables)}
          --
          {JSON.stringify(subs)}
          --
          {JSON.stringify(configs)}
        </div>
      </div>
      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </>
  )
}

export default DisplayText
