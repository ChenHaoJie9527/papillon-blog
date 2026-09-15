'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalSectionProps } from './types'

export function ModalDescription({ children, className, ...props }: ModalSectionProps) {
  const { Description } = useModalContext('ModalDescription')
  return (
    <Description className={cn(className)} {...props}>
      {children}
    </Description>
  )
}
