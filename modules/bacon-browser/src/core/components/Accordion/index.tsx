import { useStyletron } from 'baseui'
import React, { createRef, isValidElement, useEffect, useState } from 'react'

import { AccordionBody } from './AccordionBody'
import { AccordionHeader } from './AccordionHeader'

export const Accordion: React.FC<{ defaultHeight?: number; isOpen: boolean }> = ({ children, defaultHeight, isOpen }) => {
  const header = createRef<HTMLDivElement>()
  const wrapper = createRef<HTMLDivElement>()

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
