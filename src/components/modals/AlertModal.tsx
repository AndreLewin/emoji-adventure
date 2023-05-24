import { Button } from '@mantine/core';
import { ContextModalProps } from '@mantine/modals';
import { useCallback } from 'react';

const AlertModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string }>) => {
  const handleClose = useCallback<any>(() => {
    context.closeModal(id)
  }, [])

  return (
    <>
      <div className="modal-body" dangerouslySetInnerHTML={{ __html: innerProps.modalBody }}></div>
      <Button style={{ width: "100%" }} variant="outline" color="gray" onClick={() => handleClose()}>
        OK
      </Button>
      <style jsx>
        {`
          .modal-body {
            white-space: pre-wrap;
            margin-bottom: 15px;
          }
        `}
      </style>
    </>
  )
}

export default AlertModal