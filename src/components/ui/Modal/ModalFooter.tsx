'use client'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import type { ModalSectionProps } from './types'

export function ModalFooter({ children, className, ...props }: ModalSectionProps) {
  const { Footer } = useModalContext('ModalFooter')
  return (
    <Footer className={cn('shrink-0', className)} {...props}>
      {children}
    </Footer>
  )
}
