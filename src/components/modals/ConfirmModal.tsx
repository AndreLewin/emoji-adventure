import { Button } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useCallback } from 'react';

const ConfirmModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string, resolve: typeof Promise.resolve }>) => {
  const handleCancel = useCallback<any>(() => {
    innerProps.resolve(false)
    context.closeModal(id)
  }, [])
  const handleConfirm = useCallback<any>(() => {
    innerProps.resolve(true)
    context.closeModal(id)
  }, [])

  return (
    <>
      <div className="modal-body" dangerouslySetInnerHTML={{ __html: innerProps.modalBody }}></div>
      <div className="buttons-wrapper">
        <Button style={{ width: "100%" }} variant="outline" color="red" onClick={handleCancel}>
          ❌
        </Button>
        <Button data-autofocus style={{ width: "100%" }} variant="outline" color="green" onClick={handleConfirm}>
          ✔️
        </Button>
      </div>
      <style jsx>
        {`
          .modal-body {
            white-space: pre-wrap;
          }

          .buttons-wrapper {
            margin-top: 20px;
            display: flex;
            justify-content: space-between;
            gap: 20px;
          }
        `}
      </style>
    </>
  )
}

export default ConfirmModal