'use client'

import type { ReactNode } from 'react'
import { overlay } from 'overlay-kit'

import { Modal, ModalContent, type ModalSize } from '@components/ui/Modal'

export interface OpenModalClose {
  close: () => void
}

export interface OpenModalAsyncClose<T> {
  close: (value?: T) => void
}

export interface OpenModalOptions {
  size?: ModalSize
  children: (ctx: OpenModalClose) => ReactNode
}

export interface OpenModalAsyncOptions<T> {
  size?: ModalSize
  children: (ctx: OpenModalAsyncClose<T>) => ReactNode
}

export function openModal({ size, children }: OpenModalOptions) {
  overlay.open(({ isOpen, close, unmount }) => (
    <Modal
      open={isOpen}
      size={size}
      onOpenChange={(next) => {
        if (!next) close()
      }}
      onExit={unmount}
    >
      <ModalContent>{children({ close })}</ModalContent>
    </Modal>
  ))
}

export function openModalAsync<T>({ size, children }: OpenModalAsyncOptions<T>) {
  return overlay.openAsync<T | undefined>(({ isOpen, close, unmount }) => (
    <Modal
      open={isOpen}
      size={size}
      onOpenChange={(next) => {
        if (!next) close(undefined)
      }}
      onExit={unmount}
    >
      <ModalContent>{children({ close })}</ModalContent>
    </Modal>
  ))
}
