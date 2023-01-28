import Variables from "./adventureInfo/Variables"
import Scripts from "./adventureInfo/Scripts"

const AdventureInfo: React.FC<{}> = ({ }) => {

  return (
    <>
      <div className='container'>
        <Variables />
        <Scripts />
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

export default AdventureInfo