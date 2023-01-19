import { Dispatch, SetStateAction, useCallback, useState } from "react"
import { Button, Drawer } from "@mantine/core"
import store, { Cell } from "../store"

// https://github.com/react-simple-script-editor/react-simple-script-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import CodeGenerationButtons from "./cellDrawer/CodeGenerationButtons";
import ShorthandsInfo from "./cellDrawer/ShorthandsInfo";
import Tips from "./cellDrawer/Tips";
import { getHotkeyHandler } from "@mantine/hooks";

const CellDrawer: React.FC<{ isDrawerOpened: boolean, setIsDrawerOpened: Dispatch<SetStateAction<boolean>>, cell: Cell, gridId: number, cellIndex: number }> = (
  { isDrawerOpened, setIsDrawerOpened, cell, gridId, cellIndex }
) => {

  const [script, setScript] = useState<string>(cell.script)

  const updateCell = store(state => state.updateCell)

  const handleSave = useCallback<any>(() => {
    updateCell({ gridId, cellIndex, cellUpdate: { script } })
  }, [gridId, cellIndex, script])

  return (
    <Drawer
      opened={isDrawerOpened}
      onClose={() => setIsDrawerOpened(false)}
      position="right" transitionDuration={0} overlayOpacity={0.2} size="xl" styles={{ header: { display: 'none' } }}
    >
      <div className="container">

        <CodeGenerationButtons setScript={setScript} />

        <div style={{ marginTop: "10px" }} />

        <Editor
          value={script}
          onValueChange={script => setScript(script)}
          highlight={script => highlight(script, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira script", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid black",
            backgroundColor: "#ededf0"
          }}
          onKeyDown={getHotkeyHandler([
            ['ctrl+Enter', (event) => { handleSave(), setIsDrawerOpened(false) }]
          ])}
        />

        <div style={{ marginTop: "10px" }} />

        <Button
          disabled={script === cell.script}
          onClick={handleSave}
        >
          Save Script
        </Button>

        <Button onClick={() => eval(script)}>
          Try Script
        </Button>

        <ShorthandsInfo />
        <Tips />
      </div>
      <style jsx>
        {`
          .container {
            padding: 10px;
          }
        `}
      </style>
    </Drawer>
  )
}

export default CellDrawer