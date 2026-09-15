'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalSectionProps } from './types'

export function ModalTitle({ children, className, ...props }: ModalSectionProps) {
  const { Title } = useModalContext('ModalTitle')
  return (
    <Title className={cn(className)} {...props}>
      {children}
    </Title>
  )
}
