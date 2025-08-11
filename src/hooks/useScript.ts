import { useEffect, useRef, useState } from 'react'

type Options = {
  removeOnUnmount: boolean
}

export default function useScript(src: string, options: Options) {
  const [status, setStatus] = useState<'loading' | 'ready' | 'error' | 'unknown'>(
    'loading',
  )
  const optionRef = useRef(options)

  useEffect(() => {
    // 检查是否已经加载了脚本
    let script: HTMLScriptElement | null = document.querySelector(`script[src="${src}"]`)

    // 检查脚本状态
    const domStatus = script?.getAttribute('data-status')

    // 如果脚本已经加载，则设置状态
    if (domStatus) {
      setStatus(domStatus as 'loading' | 'ready' | 'error' | 'unknown')
      return
    }

    if (script === null) {
      script = document.createElement('script')
      script.src = src
      script.async = true
      script.setAttribute('data-status', 'loading')

      document.body.appendChild(script)

      const handleScriptLoad = () => {
        script?.setAttribute('data-status', 'ready')
        setStatus('ready')
        removeEventListeners()
      }

      const handleScriptError = () => {
        script?.setAttribute('data-status', 'error')
        setStatus('error')
        removeEventListeners()
      }

      const removeEventListeners = () => {
        script?.removeEventListener('load', handleScriptLoad)
        script?.removeEventListener('error', handleScriptError)
      }

      script.addEventListener('load', handleScriptLoad)
      script.addEventListener('error', handleScriptError)

      const removeOnUnmount = optionRef.current.removeOnUnmount

      return () => {
        if (removeOnUnmount) {
          // 移除脚本
          script?.remove()
          removeEventListeners()
        }
      }
    } else {
      setStatus('unknown')
    }
  }, [src])

  return status
}
