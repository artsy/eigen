import { useLayoutEffect, useRef, useState } from "react"
import { LayoutRectangle, View } from "react-native"

export const useLayout = () => {
  const [layout, setLayout] = useState<LayoutRectangle>({
    x: 0,
    y: 0,
    width: 0,
    height: 0,
  })
  const ref = useRef<View>(null)

  useLayoutEffect(() => {
    ref.current?.measureInWindow((x, y, width, height) => {
      setLayout({ x, y, width, height })
    })
  }, [])

  return { layout, ref }
}
