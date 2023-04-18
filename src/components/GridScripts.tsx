// https://github.com/react-simple-script-editor/react-simple-script-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import store, { Grid } from '../store';
import { Button, Tabs } from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { evalScript } from '../utils/evalScript';

const GridScripts: React.FC<{}> = ({ }) => {
  const set = store(state => state.set)
  const activeGridId = store(state => state.activeGridId)
  const grids = store(state => state.grids)
  const updateGrid = store(state => state.updateGrid)

  const grid = useMemo<Grid>(() => {
    return grids.find(g => g.id === activeGridId)!
  }, [activeGridId, grids])

  const [activeGScriptTab, setActiveGScriptTab] = useState<"onViewGScript" | "onInitGScript">("onViewGScript")

  const gridScript = useMemo<string>(() => {
    return grid[activeGScriptTab] ?? ""
  }, [grid, activeGScriptTab])

  const setScript = useCallback<any>((script: string) => {
    updateGrid({
      gridId: activeGridId,
      gridUpdate: {
        [activeGScriptTab]: script
      }
    })
  }, [activeGScriptTab, updateGrid, activeGridId])

  return (
    <>
      <div className='container'>
        <Tabs
          value={activeGScriptTab}
          onTabChange={(value) => setActiveGScriptTab(value as "onViewGScript" | "onInitGScript")}
        >
          <Tabs.List>
            <Tabs.Tab
              value="onViewGScript"
            >
              On View
            </Tabs.Tab>
            <Tabs.Tab
              value="onInitGScript"
            >
              On Init
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Editor
          value={gridScript}
          placeholder={
            activeGScriptTab === "onViewGScript" ?
              "Script to execute when the grid comes into view" :
              "Script to execute when the adventure is loaded (shorthands use grid context) (good place for map subscribers)"
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
        />
        <Button onClick={() => evalScript(gridScript, { gridId: activeGridId })}>
          Try Script
        </Button>
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

export default GridScripts