import { useEffect, useRef, useState } from "react"

/**
 * Returns width of container element
 * @param ref reference to wrapper component
 */
export const useWrapperWidth = (ref: React.RefObject<HTMLElement>) => {
  const [width, setWidth] = useState(0)

  const widthCheckInterval = useRef(null)

  useEffect(() => {
    const setContainerWidth = () => {
      if (ref.current) {
        setWidth(ref.current.getBoundingClientRect().width - 5)
      }
    }

    setContainerWidth()

    widthCheckInterval.current = setInterval(setContainerWidth, 500)

    window.addEventListener("resize", setContainerWidth)

    return function cleanup() {
      window.removeEventListener("resize", setContainerWidth)
      clearInterval(widthCheckInterval.current)
    }
  }, [])

  return width
}
