import { createPicker } from 'picmo'
// import { TwemojiRenderer } from '@picmo/renderer-twemoji';
import { useEffect } from 'react';
import store from '../../store';

const EmojiPicker: React.FC<{}> = ({ }) => {
  const pickEmoji = store(state => state.pickEmoji)

  useEffect(() => {
    // The picker must have a root element to insert itself into
    const rootElement = document.querySelector('#pickerContainer')!

    // Create the picker
    const picker = createPicker({
      // @ts-ignore
      rootElement,
      // renderer: new TwemojiRenderer(),
      emojiSize: "1.7rem",
      showPreview: false,
      showRecents: false
    });

    picker.addEventListener('emoji:select', event => {
      pickEmoji(event.emoji)
    });
  }, [])

  return (
    <>
      <div id="pickerContainer" />
      <style jsx global>
        {`
          h3.categoryName {
            display: none !important;
          }
        `}
      </style>
    </>
  )
}

export default EmojiPicker