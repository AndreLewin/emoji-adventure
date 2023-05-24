import { ContextModalProps } from '@mantine/modals';

const AlertModal = ({ context, id, innerProps }: ContextModalProps<{ modalBody: string }>) => {

  return (
    <>
      <div className="modal-body" dangerouslySetInnerHTML={{ __html: innerProps.modalBody }}></div>
      <style jsx>
        {`
          .modal-body {
            white-space: pre-wrap;
          }
        `}
      </style>
    </>
  )
}

export default AlertModal