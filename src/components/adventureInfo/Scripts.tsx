// https://github.com/react-simple-script-editor/react-simple-script-editor
import Editor from 'react-simple-code-editor';
// @ts-ignore
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/themes/prism.css';
import store from '../../store';
import { Button } from '@mantine/core';

const Scripts: React.FC<{}> = ({ }) => {
  const onStartScript = store(state => state.onStartScript)
  const set = store(state => state.set)


  return (
    <>
      <div className='container'>
        Script to execute when the Adventure is loaded:
        <Editor
          value={onStartScript}
          onValueChange={script => set({ onStartScript: script })}
          highlight={script => highlight(script, languages.js)}
          padding={10}
          style={{
            fontFamily: '"Fira script", "Fira Mono", monospace',
            fontSize: 14,
            border: "1px solid black",
            backgroundColor: "#ededf0"
          }}
        />
        <Button onClick={() => eval(onLoadScript)}>
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