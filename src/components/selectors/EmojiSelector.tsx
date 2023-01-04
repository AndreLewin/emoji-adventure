import { createPicker } from 'picmo'
import { TwemojiRenderer } from '@picmo/renderer-twemoji';
import { useEffect } from 'react';
import store from '../../store';

const EmojiSelector: React.FC<{}> = ({ }) => {
  const set = store(state => state.set)
  const selectedEmoji = store(state => state.selectedEmoji)

  useEffect(() => {
    // The picker must have a root element to insert itself into
    const rootElement = document.querySelector('#pickerContainer')!

    // Create the picker
    const picker = createPicker({
      // @ts-ignore
      rootElement,
      renderer: new TwemojiRenderer(),
      emojiSize: "1.7rem",
      showPreview: false
    });

    picker.addEventListener('emoji:select', event => {
      set({ selectedEmoji: event.emoji })
      console.log('Emoji selected:', event.emoji);
    });
  }, [])

  return (
    <>
      <div id="pickerContainer">
        aaa
      </div>
      <style jsx>
        {`
          
        `}
      </style>
    </>
  )
}

export default EmojiSelector