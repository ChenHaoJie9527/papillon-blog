import type { ReactNode } from 'react'
import { motion } from 'motion/react'
import { cn } from '@components/lib/utils'
import { useSelectContext } from './context'
import { tagTransition } from './motion'

export function SelectTag({
  className,
  children,
}: {
  className?: string
  children: ReactNode
}) {
  const { reduce } = useSelectContext('SelectTag')

  return (
    <motion.span
      data-slot="select-tag"
      layout={reduce ? false : 'position'}
      initial={reduce ? false : { opacity: 0, scale: 0.85 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={reduce ? undefined : { opacity: 0, scale: 0.85 }}
      transition={reduce ? { duration: 0 } : tagTransition}
      style={{ originX: 0, originY: 0.5, borderRadius: 6 }}
      className={cn(
        'inline-flex max-w-full min-w-0 shrink-0 items-center truncate rounded-md border border-accent/20 bg-accent/10 px-1.5 py-0.5 text-xs text-foreground',
        className,
      )}
    >
      {children}
    </motion.span>
  )
}
