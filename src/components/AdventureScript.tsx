// https://github.com/react-simple-script-editor/react-simple-script-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import store from '../store';
import { Button, Tabs } from '@mantine/core';
import { useCallback, useMemo } from 'react';
import { evalScript } from '../utils/evalScript';

const Scripts: React.FC<{}> = ({ }) => {
  const onInitAScript = store(state => state.onInitAScript)
  const set = store(state => state.set)

  const setExampleScript = useCallback<any>(() => {
    const scriptToAppend = `// define an adventure variable "hp" with value 10\n#.hp = 10\n// make the variable visible as "Health points"\n#%.hp = "Health points"\n// if it reaches 0 (or less) display a sad message\n#$.hp.push(value => (value <= 0 && __a("nooo, you are dead :(")))\n\n// make an adventure function to take damages\n#.takeDamages = (damages) => {\n  #.hp = #.hp - damages\n}\n// you can now use #.takeDamages in any script\n#.takeDamages(20)`
    const script = `${onInitAScript}${onInitAScript === "" ? "" : "\n"}${scriptToAppend}`
    set({ onInitAScript: script })
  }, [onInitAScript, set])

  return (
    <>
      <div className='container'>
        <Tabs
          value={onInitAScript}
        >
          <Tabs.List>
            <Tabs.Tab
              style={{
                "background": ((onInitAScript ?? "") !== "") ? "linear-gradient(to bottom left, #ffffff75, #32328775)" : "",
              }}
              value="onInitAScript"
            >
              On Init
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Editor
          value={onInitAScript ?? ""}
          placeholder="Script to execute when the adventure is loaded (good place for adventure subscribers and global functions)"
          onValueChange={script => set({ onInitAScript: script })}
          highlight={script => highlight(script, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira script", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid black",
            backgroundColor: "#ededf0"
          }}
        />
        <Button onClick={() => evalScript(onInitAScript)}>
          Try Script
        </Button>
        <Button color="gray" onClick={() => setExampleScript()}>
          Example Script
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

export default Scripts