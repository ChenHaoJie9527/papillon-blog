import { createContext, useContext } from 'react'

import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'
import {
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/ui/drawer'

import type { ModalSize } from './types'

export interface ModalContextValue {
  isMobile: boolean
  size: ModalSize
  fireExit: () => void
  Trigger: typeof DialogTrigger | typeof DrawerTrigger
  Close: typeof DialogClose | typeof DrawerClose
  Content: typeof DialogContent | typeof DrawerContent
  Header: typeof DialogHeader | typeof DrawerHeader
  Title: typeof DialogTitle | typeof DrawerTitle
  Description: typeof DialogDescription | typeof DrawerDescription
  Footer: typeof DialogFooter | typeof DrawerFooter
}

export const ModalContext = createContext<ModalContextValue | null>(null)

export function useModalContext(component: string): ModalContextValue {
  const context = useContext(ModalContext)
  if (!context) {
    throw new Error(`${component} 必须放在 <Modal> 内部使用`)
  }
  return context
}
