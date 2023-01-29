import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
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
  const updateCell = store(state => state.updateCell)

  const onClickScript = useMemo<string>(() => {
    return cell.onClickScript ?? ""
  }, [cell])

  const setOnClickScript = useCallback<any>((onClickScript: string) => {
    updateCell({
      gridId,
      cellIndex,
      cellUpdate: {
        onClickScript
      }
    })
  }, [gridId, cellIndex])

  return (
    <Drawer
      opened={isDrawerOpened}
      onClose={() => setIsDrawerOpened(false)}
      position="right" transitionDuration={0} overlayOpacity={0.2} size="xl" styles={{ header: { display: 'none' } }}
    >
      <div className="container">

        <CodeGenerationButtons gridId={gridId} cellIndex={cellIndex} />

        <div style={{ marginTop: "10px" }} />

        OnClickScript
        <Editor
          value={onClickScript}
          onValueChange={script => setOnClickScript(script)}
          highlight={script => highlight(script, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira script", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid black",
            backgroundColor: "#ededf0"
          }}
          onKeyDown={getHotkeyHandler([
            ['ctrl+Enter', () => { setIsDrawerOpened(false) }]
          ])}
        />

        <div style={{ marginTop: "10px" }} />

        <Button onClick={() => eval(onClickScript)}>
          Try Script
        </Button>

        {/* <ShorthandsInfo /> */}
        <Tips />
        <div></div>
        {'WIP: Shorthands (like "$wa" instead of "$window.alert")'}
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