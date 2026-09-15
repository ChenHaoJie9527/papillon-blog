import type { ReactNode } from 'react'

export type ModalSize = 'sm' | 'md' | 'lg'

export interface ModalProps {
  open?: boolean
  defaultOpen?: boolean
  onOpenChange?: (open: boolean) => void
  size?: ModalSize
  onExit?: () => void
  children: ReactNode
}

export interface ModalTriggerProps {
  className?: string
  asChild?: boolean
  children?: ReactNode
}

export interface ModalCloseProps {
  className?: string
  asChild?: boolean
  children?: ReactNode
}

export interface ModalContentProps {
  className?: string
  children?: ReactNode
  showCloseButton?: boolean
}

export interface ModalSectionProps {
  className?: string
  children?: ReactNode
}
