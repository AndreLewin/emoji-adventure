import { Dispatch, SetStateAction, useState } from "react"
import { Button, Drawer } from "@mantine/core"
import { Cell } from "../store"

// https://github.com/react-simple-code-editor/react-simple-code-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css'; //Example style, you can use another

const CellDrawer: React.FC<{ isDrawerOpened: boolean, setIsDrawerOpened: Dispatch<SetStateAction<boolean>>, cell: Cell, index: number }> = (
  { isDrawerOpened, setIsDrawerOpened, cell, index }
) => {

  const [code, setCode] = useState(
    `console.log(window._s())`
  );

  return (
    <Drawer opened={isDrawerOpened} onClose={() => setIsDrawerOpened(false)} title={`Cell ${index}`} position="right" transitionDuration={0} overlayOpacity={0.2} size="xl">
      CONTENT

      <Editor
        value={code}
        onValueChange={code => setCode(code)}
        highlight={code => highlight(code, languages.js)}
        padding={10}
        style={{
          fontFamily: '"Fira code", "Fira Mono", monospace',
          fontSize: 14,
        }}
      />

      <Button onClick={() => eval(code)}>
        Run code
      </Button>


      <style jsx>
        {`
          .container {
            
          }
        `}
      </style>
    </Drawer>
  )
}

export default CellDrawer