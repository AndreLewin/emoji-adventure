import { Button, TextInput } from '@mantine/core';
import { getHotkeyHandler } from '@mantine/hooks';
import { ContextModalProps } from '@mantine/modals';
import { useCallback, useState } from 'react';

const PromptModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string, resolve: typeof Promise.resolve, choices: string[] }>) => {
  const [value, setValue] = useState("")

  const handleConfirm = useCallback<any>((choice: string) => {
    innerProps.resolve(value)
    context.closeModal(id)
  }, [value])

  const handleEnter = useCallback<any>(() => {
    handleConfirm()
  }, [handleConfirm])

  return (
    <>
      <div className="modal-body" dangerouslySetInnerHTML={{ __html: innerProps.modalBody }}></div>
      <div className="input-wrapper">
        <TextInput
          value={value}
          onChange={(e) => setValue(e.currentTarget.value ?? "")}
          onKeyDown={getHotkeyHandler([
            ['Enter', handleEnter]
          ])}
        />
      </div>
      <div className="buttons-wrapper">
        <Button style={{ width: "100%" }} variant="outline" onClick={() => handleConfirm()}>
          OK
        </Button>
      </div>
      <style jsx>
        {`
          .modal-body {
            white-space: pre-wrap;
          }

          .input-wrapper {
            margin-top: 20px;
          }

          .buttons-wrapper {
            margin-top: 20px;
            display: flex;
            flex-wrap: wrap;
            justify-content: space-between;
            gap: 20px;
          }
        `}
      </style>
    </>
  )
}

export default PromptModal