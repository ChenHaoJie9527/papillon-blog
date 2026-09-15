'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalTriggerProps } from './types'

export function ModalTrigger({ children, className, ...props }: ModalTriggerProps) {
  const { Trigger } = useModalContext('ModalTrigger')
  return (
    <Trigger className={cn(className)} {...props}>
      {children}
    </Trigger>
  )
}
