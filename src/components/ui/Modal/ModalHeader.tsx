'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalSectionProps } from './types'

export function ModalHeader({ children, className, ...props }: ModalSectionProps) {
  const { Header } = useModalContext('ModalHeader')
  return (
    <Header className={cn('shrink-0', className)} {...props}>
      {children}
    </Header>
  )
}
