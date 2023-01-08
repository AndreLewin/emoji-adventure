import { Dispatch, SetStateAction } from "react";
import DisplayText from "./codeGenerationButtons/DisplayText";

const CodeGenerationButtons: React.FC<{ setScript: Dispatch<SetStateAction<string>> }> = ({ setScript }) => {

  return (
    <>
      <div className='container'>
        <DisplayText setScript={setScript} />
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