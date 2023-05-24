// xxx annoying black flash between each modal...
const OVERLAY_OPACITY = 0.1

export const alertModal = (htmlContent: string) => {
  if (typeof htmlContent !== "string") throw new Error(`The first argument must be a html string (example: "Hello <b>world</b>!")`)

  return new Promise((resolve, reject) => {
    window._openContextModal({
      modal: 'alertModal',
      innerProps: {
        modalBody: htmlContent,
      },
      withCloseButton: false,
      overlayOpacity: OVERLAY_OPACITY,
      onClose: () => resolve(true)
    })
  });
}

export const confirmModal = (htmlContent: string) => {
  if (typeof htmlContent !== "string") throw new Error(`The first argument must be a html string (example: "Hello <b>world</b>!")`)

  return new Promise((resolve, reject) => {
    window._openContextModal({
      modal: 'confirmModal',
      innerProps: {
        modalBody: htmlContent,
        resolve
      },
      withCloseButton: false,
      closeOnClickOutside: false,
      overlayOpacity: OVERLAY_OPACITY,
      onClose: () => resolve(false) // handle "Escape" and if somehow the player managed to get out
    })
  });
};

export const multipleChoiceModal = (htmlContent: string, choices: string[]) => {
  if (typeof htmlContent !== "string") throw new Error(`The first argument must be a html string (example: "Hello <b>world</b>!")`)
  if (!Array.isArray(choices) || choices.length === 0) throw new Error(`The second argument must be a non-empty array of strings (example: ["Choice A", "Choice B"])`)

  return new Promise((resolve, reject) => {
    window._openContextModal({
      modal: 'multipleChoiceModal',
      innerProps: {
        modalBody: htmlContent,
        resolve,
        choices
      },
      withCloseButton: false,
      closeOnClickOutside: false,
      closeOnEscape: false,
      overlayOpacity: OVERLAY_OPACITY,
      onClose: () => resolve("") // if somehow the player managed to get out
    })
  });
};

export const promptModal = (htmlContent: string) => {
  if (typeof htmlContent !== "string") throw new Error(`The first argument must be a html string (example: "Hello <b>world</b>!")`)

  return new Promise((resolve, reject) => {
    window._openContextModal({
      modal: 'promptModal',
      innerProps: {
        modalBody: htmlContent,
        resolve
      },
      withCloseButton: false,
      closeOnClickOutside: false,
      overlayOpacity: OVERLAY_OPACITY,
      onClose: () => resolve("") // if somehow the player managed to get out
    })
  });
};
