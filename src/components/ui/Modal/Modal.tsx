'use client'

import { useCallback, useEffect, useMemo, useRef } from 'react'

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@components/ui/dialog'
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from '@components/ui/drawer'
import { useMediaQuery } from '@hooks/useMediaQuery'

import { ModalContext } from './context'
import type { ModalProps } from './types'

/** jsdom 没有关动画；真实浏览器会先走 animationend。 */
const EXIT_FALLBACK_MS = 400

/**
 * 弹窗根：≤640px 用 Drawer，否则用 Dialog。
 * 不依赖 overlay-kit；只认 open / onOpenChange / size / onExit。
 */
export function Modal({ children, size = 'md', onExit, ...props }: ModalProps) {
  const isMobile = useMediaQuery('mobile', {
    defaultValue: false,
    initializeWithValue: false,
  })
  const onExitRef = useRef(onExit)
  onExitRef.current = onExit
  const exitedRef = useRef(false)

  const fireExit = useCallback(() => {
    if (exitedRef.current) return
    exitedRef.current = true
    onExitRef.current?.()
  }, [])

  useEffect(() => {
    if (props.open) exitedRef.current = false
  }, [props.open])

  useEffect(() => {
    if (props.open !== false) return
    const id = window.setTimeout(() => fireExit(), EXIT_FALLBACK_MS)
    return () => window.clearTimeout(id)
  }, [props.open, fireExit])

  const contextValue = useMemo(
    () => ({
      isMobile,
      size,
      fireExit,
      Trigger: isMobile ? DrawerTrigger : DialogTrigger,
      Close: isMobile ? DrawerClose : DialogClose,
      Content: isMobile ? DrawerContent : DialogContent,
      Header: isMobile ? DrawerHeader : DialogHeader,
      Title: isMobile ? DrawerTitle : DialogTitle,
      Description: isMobile ? DrawerDescription : DialogDescription,
      Footer: isMobile ? DrawerFooter : DialogFooter,
    }),
    [isMobile, size, fireExit],
  )

  const Comp = isMobile ? Drawer : Dialog
  const drawerProps = isMobile ? { autoFocus: true } : {}

  return (
    <ModalContext value={contextValue}>
      <Comp {...props} {...drawerProps}>
        {children}
      </Comp>
    </ModalContext>
  )
}
