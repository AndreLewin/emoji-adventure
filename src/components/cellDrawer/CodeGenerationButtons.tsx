import { Dispatch, SetStateAction } from "react";
import DisplayText from "./codeGenerationButtons/DisplayText";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";

const CodeGenerationButtons: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <DisplayText setScript={setScript} />
        <MoveToGrid setScript={setScript} cellIndex={cellIndex} />
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

export default CodeGenerationButtons