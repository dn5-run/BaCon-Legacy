import { useStyletron } from 'baseui'
import React, { useRef } from 'react'
import { isValidElement, useEffect, useState } from 'react'

import { AccordionBody } from './accordion-body'
import { AccordionHeader } from './accordion-header'

export const Accordion: React.FC<{ defaultHeight?: number; isOpen: boolean }> = ({ children, defaultHeight, isOpen }) => {
  const header = useRef<HTMLDivElement>(null)
  const wrapper = useRef<HTMLDivElement>(null)

  const [css] = useStyletron()
  const [maxHeight, setMaxHeight] = useState(`${defaultHeight ?? 58}px`)

  useEffect(() => {
    if (wrapper.current && header.current) setMaxHeight(`${isOpen ? wrapper.current.scrollHeight : header.current.scrollHeight}px`)
  }, [isOpen])

  const accordionHeader = React.Children.toArray(children).find(
    (child) => isValidElement(child) && child.type === AccordionHeader,
  ) as React.ReactElement
  const accordionBody = React.Children.toArray(children).find((child) => isValidElement(child) && child.type === AccordionBody)
  if (!accordionHeader || !accordionBody) throw new Error('Accordion must have AccordionHeader and AccordionBody')

  return (
    <div
      ref={wrapper}
      className={css({
        overflow: 'hidden',
        maxHeight,
        transition: 'all 0.3s ease-out',
      })}
    >
      <div ref={header}>{accordionHeader}</div>
      <div
        className={css({
          marginTop: '1rem',
        })}
      >
        {accordionBody}
      </div>
    </div>
  )
}

export { AccordionBody, AccordionHeader }
