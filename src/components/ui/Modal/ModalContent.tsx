'use client'

import type { AnimationEvent } from 'react'

import { cn } from '@components/lib/utils'

import { useModalContext } from './context'
import { modalSizeClass } from './sizes'
import type { ModalContentProps } from './types'

export function ModalContent({ children, className, ...props }: ModalContentProps) {
  const { Content, isMobile, size, fireExit } = useModalContext('ModalContent')

  const handleAnimationEnd = (event: AnimationEvent<HTMLElement>) => {
    if (event.target !== event.currentTarget) return
    if (event.currentTarget.dataset.state === 'closed') fireExit()
  }

  return (
    <Content
      className={cn(
        'flex max-h-[80vh] flex-col overflow-hidden',
        !isMobile && modalSizeClass[size],
        className,
      )}
      onAnimationEnd={handleAnimationEnd}
      {...props}
    >
      {children}
    </Content>
  )
}
