import { useState, useEffect, useRef } from 'react'

/**
 * Lightweight count-up animation hook using requestAnimationFrame.
 * Animates from the previous value to the new target with ease-out cubic.
 */
export function useCountUp(target, duration = 800) {
  const [display, setDisplay] = useState(0)
  const prevTarget = useRef(0)

  useEffect(() => {
    if (target == null || isNaN(target)) {
      setDisplay(0)
      return
    }
    const from = prevTarget.current
    prevTarget.current = target
    let start = null
    let raf

    const step = (ts) => {
      if (!start) start = ts
      const progress = Math.min((ts - start) / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setDisplay(from + (target - from) * eased)
      if (progress < 1) raf = requestAnimationFrame(step)
    }

    raf = requestAnimationFrame(step)
    return () => cancelAnimationFrame(raf)
  }, [target, duration])

  return display
}
