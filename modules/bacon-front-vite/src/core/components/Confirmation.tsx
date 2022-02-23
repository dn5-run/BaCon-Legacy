import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, SIZE, ROLE } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import { createContext, useContext, useState } from 'react'

const ConfirmationContext = createContext((title: string, msg: string) => {
  return new Promise((resolve, reject) => {
    reject('Context not initialized')
  })
})
export const useConfirmation = () => useContext(ConfirmationContext)

export const ConfirmationProvider: React.FC = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')

  const [onClick, setOnClick] = useState<(result: boolean) => void>(() => {})

  const handler = (title: string, msg: string) => {
    return new Promise((resolve) => {
      console.log('handler')
      setOnClick(() => {
        return (result: boolean) => resolve(result)
      })
      setTitle(title)
      setMsg(msg)
      setIsOpen(true)
    })
  }

  return (
    <ConfirmationContext.Provider value={handler}>
      {children}
      <Modal
        onClose={() => setIsOpen(false)}
        unstable_ModalBackdropScroll
        closeable
        isOpen={isOpen}
        animate
        autoFocus
        size={SIZE.default}
        role={ROLE.dialog}
      >
        <ModalHeader>
          <ParagraphMedium>{title}</ParagraphMedium>
        </ModalHeader>
        <ModalBody>{msg}</ModalBody>
        <ModalFooter>
          <ModalButton
            kind="tertiary"
            onClick={() => {
              setIsOpen(false)
              onClick(false)
            }}
          >
            Cancel
          </ModalButton>
          <ModalButton
            onClick={() => {
              setIsOpen(false)
              onClick(true)
            }}
          >
            OK
          </ModalButton>
        </ModalFooter>
      </Modal>
    </ConfirmationContext.Provider>
  )
}
