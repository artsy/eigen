import { useEffect, useState } from "react"

/**
 * Returns true when component enters viewport
 * @param ref reference to component
 */
export const useHasEnteredViewport = (ref: React.RefObject<HTMLElement>) => {
  const [hasEntered, setHasEntered] = useState(false)
  useEffect(() => {
    const handleScroll = () => {
      const rect = ref.current.getBoundingClientRect()
      if (rect.top <= window.innerHeight - rect.height) {
        setHasEntered(true)
        window.removeEventListener("scroll", handleScroll)
      }
    }
    window.addEventListener("scroll", handleScroll)
    window.dispatchEvent(new Event("scroll"))
    return () => {
      window.removeEventListener("scroll", handleScroll)
    }
  }, [])
  return hasEntered
}
