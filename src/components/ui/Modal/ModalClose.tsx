'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalCloseProps } from './types'

export function ModalClose({ children, className, ...props }: ModalCloseProps) {
  const { Close } = useModalContext('ModalClose')
  return (
    <Close className={cn(className)} {...props}>
      {children}
    </Close>
  )
}
