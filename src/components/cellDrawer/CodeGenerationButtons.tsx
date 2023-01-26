import { Dispatch, SetStateAction } from "react";
import DisplayText from "./codeGenerationButtons/DisplayText";
import MoveToGrid from "./codeGenerationButtons/MoveToGrid";
import AskForName from "./codeGenerationButtons/AskForName";
import GlobalVariable from "./codeGenerationButtons/GlobalVariable";
import RemoveScript from "./codeGenerationButtons/RemoveScript";
import ChangeEmoji from "./codeGenerationButtons/ChangeEmoji";
import MapVariable from "./codeGenerationButtons/MapVariable";

const CodeGenerationButtons: React.FC<{ setScript: Dispatch<SetStateAction<string>>, cellIndex: number }> = ({ setScript, cellIndex }) => {

  return (
    <>
      <div className='container'>
        <DisplayText setScript={setScript} />
        <MoveToGrid setScript={setScript} cellIndex={cellIndex} />
        <div />
        <AskForName setScript={setScript} />
        <GlobalVariable setScript={setScript} />
        <div />
        <RemoveScript setScript={setScript} cellIndex={cellIndex} />
        <ChangeEmoji setScript={setScript} cellIndex={cellIndex} />
        <div />
        <MapVariable setScript={setScript} cellIndex={cellIndex} />
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