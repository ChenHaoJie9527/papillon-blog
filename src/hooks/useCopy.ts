import { useCallback, useState } from 'react'

function useCopy() {
  const [copied, setCopied] = useState<string>('')
  const copyHandle = async (value: string) => {
    try {
      // 优先使用现代 Clipboard API
      if (navigator?.clipboard?.writeText) {
        await navigator.clipboard.writeText(value)
        setCopied(value)
      } else {
        throw new Error('writeText not supported')
      }
    } catch (error) {
      oldSchoolCopy(value)
      setCopied(value)
    }
  }
  const resetHandle = useCallback(() => {
    setCopied('')
  }, [])

  return {
    copied,
    copyHandle,
    resetHandle,
  }
}

function oldSchoolCopy(text: string) {
  try {
    const tempTextArea = document.createElement('textarea')
    tempTextArea.value = text
    tempTextArea.style.position = 'fixed'
    tempTextArea.style.left = '-999999px'
    tempTextArea.style.top = '-999999px'
    document.body.appendChild(tempTextArea)
    tempTextArea.focus()
    tempTextArea.select()
    document.execCommand('copy')
    document.body.removeChild(tempTextArea)
  } catch (error) {
    console.error('Old school copy failed:', error)
  }
}

export default useCopy
