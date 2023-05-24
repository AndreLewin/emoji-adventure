import { Button } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useCallback } from 'react';

const MultipleChoiceModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string, resolve: typeof Promise.resolve, choices: string[] }>) => {
  const handleChoice = useCallback<any>(async (choice: string) => {
    innerProps.resolve(choice)
    context.closeModal(id)
  }, [])

  return (
    <>
      <div className="modal-body" dangerouslySetInnerHTML={{ __html: innerProps.modalBody }}></div>
      <div className="buttons-wrapper">
        {innerProps.choices.map((choice, index) => {
          return (
            <Button style={{ width: "100%" }} variant="outline" onClick={() => handleChoice(choice)} key={`modal-${id}-choice-${index}`}>
              {choice}
            </Button>
          )
        })}
      </div>
      <style jsx>
        {`
          .modal-body {
            white-space: pre-wrap;
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

export default MultipleChoiceModal