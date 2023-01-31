// https://github.com/react-simple-script-editor/react-simple-script-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import store from '../store';
import { Button, Tabs } from '@mantine/core';

const Scripts: React.FC<{}> = ({ }) => {
  const onInitAScript = store(state => state.onInitAScript)
  const set = store(state => state.set)

  return (
    <>
      <div className='container'>
        <Tabs
          value={onInitAScript}
        >
          <Tabs.List>
            <Tabs.Tab
              value="onInitAScript"
            >
              On Init
            </Tabs.Tab>
          </Tabs.List>
        </Tabs>
        <Editor
          value={onInitAScript}
          placeholder="Script to execute when the adventure is loaded (good place for map subscribers and global functions)"
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
        <Button onClick={() => eval(onInitAScript)}>
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

export default Scripts