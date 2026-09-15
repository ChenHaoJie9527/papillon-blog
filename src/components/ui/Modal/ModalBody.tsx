'use client'

import { cn } from '@components/lib/utils'

import type { ModalSectionProps } from './types'

export function ModalBody({ children, className, ...props }: ModalSectionProps) {
  return (
    <div className={cn('min-h-0 flex-1 overflow-y-auto px-4 md:px-0', className)} {...props}>
      {children}
    </div>
  )
}
