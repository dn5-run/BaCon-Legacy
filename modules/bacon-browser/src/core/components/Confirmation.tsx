import { Modal, ModalHeader, ModalBody, ModalFooter, ModalButton, SIZE, ROLE } from 'baseui/modal'
import { ParagraphMedium } from 'baseui/typography'
import React, { useState } from 'react'

export const Confirmation: React.VFC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [title, setTitle] = useState('')
  const [msg, setMsg] = useState('')

  const [onClick, setOnClick] = useState<(result: boolean) => void>(() => {
    /** */
  })

  handler = (title: string, msg: string) => {
    return new Promise((resolve) => {
      setOnClick(() => {
        return (result: boolean) => resolve(result)
      })
      setTitle(title)
      setMsg(msg)
      setIsOpen(true)
    })
  }
  return (
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
  )
}
let handler: (title: string, msg: string) => Promise<boolean>
export const showConfirmation = (title: string, msg: string) => handler(title, msg)
