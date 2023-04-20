import { Dispatch, SetStateAction, useCallback, useMemo, useState } from "react"
import { Button, Drawer, Tabs } from "@mantine/core"
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
import { evalScript } from "../utils/evalScript";

const CellDrawer: React.FC<{ isDrawerOpened: boolean, setIsDrawerOpened: Dispatch<SetStateAction<boolean>>, cell: Cell, gridId: number, cellIndex: number }> = (
  { isDrawerOpened, setIsDrawerOpened, cell, gridId, cellIndex }
) => {
  const updateCell = store(state => state.updateCell)
  const activeCScriptTab = store(state => state.activeCScriptTab)

  const script = useMemo<string>(() => {
    return cell[activeCScriptTab] ?? ""
  }, [cell, activeCScriptTab])

  const setScript = useCallback<any>((script: string) => {
    updateCell({
      gridId,
      cellIndex,
      cellUpdate: {
        [activeCScriptTab]: script
      }
    })
  }, [activeCScriptTab, updateCell, gridId, cellIndex])

  const hasClickScript = useMemo<boolean>(() => {
    return (cell?.onClickCScript ?? "") !== ""
  }, [cell])
  const hasViewScript = useMemo<boolean>(() => {
    return (cell?.onViewCScript ?? "") !== ""
  }, [cell])
  const hasInitScript = useMemo<boolean>(() => {
    return (cell?.onInitCScript ?? "") !== ""
  }, [cell])

  return (
    <Drawer
      opened={isDrawerOpened}
      onClose={() => setIsDrawerOpened(false)}
      position="right" transitionDuration={0} overlayOpacity={0.2} size="xl" styles={{ header: { display: 'none' } }}
    >
      <div className="container">

        <CodeGenerationButtons gridId={gridId} cellIndex={cellIndex} />

        <div style={{ marginTop: "10px" }} />

        <Tabs
          value={activeCScriptTab}
          onTabChange={(value) => store.setState({ activeCScriptTab: value as "onClickCScript" | "onViewCScript" | "onInitCScript" })}
        >
          <Tabs.List>
            <Tabs.Tab
              style={{
                "background": hasClickScript ? "linear-gradient(to right, #d53a9d75, #3593f775)" : "",
                "opacity": (activeCScriptTab === "onClickCScript") ? 1 : 0.7
              }}
              value="onClickCScript"
            >
              On Click
            </Tabs.Tab>
            <Tabs.Tab
              style={{
                "background": hasViewScript ? "linear-gradient(to bottom, #42892975, #b3a05875)" : "",
                "opacity": (activeCScriptTab === "onViewCScript") ? 1 : 0.7
              }}
              value="onViewCScript"
            >
              On View
            </Tabs.Tab>
            <Tabs.Tab
              style={{
                "background": hasInitScript ? "linear-gradient(to bottom left, #ffffff75, #32328775)" : "",
                "opacity": (activeCScriptTab === "onInitCScript") ? 1 : 0.7
              }}
              value="onInitCScript"
            >
              On Init
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>

        <Editor
          value={script ?? ""}
          placeholder={
            activeCScriptTab === "onClickCScript" ?
              "Script to execute when the cell is clicked" :
              activeCScriptTab === "onViewCScript" ?
                "Script to execute when the grid containing the cell comes into view" :
                "Script to execute when the adventure is loaded (shorthands use cell context) (good place for cell subscribers)"
          }
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
            ['ctrl+Enter', () => { setIsDrawerOpened(false) }]
          ])}
          autoFocus={true}
        />

        <div style={{ marginTop: "10px" }} />

        <Button onClick={() => evalScript(script, { gridId, cellIndex })}>
          Try Script
        </Button>

        <Tips />
        <ShorthandsInfo />
      </div>
      <style jsx>
        {`
          .container {
            padding: 10px;

            max-height: 100vh;
            overflow-y: scroll;

            /* hide scrollbar */
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .container::-webkit-scrollbar { 
            display: none;
          }
        `}
      </style>
    </Drawer>
  )
}

export default CellDrawer