import { MutableRefObject, useEffect, useState } from "react"

type Position = {
  x: number
  y: number
  width: number
  height: number
  pageX: number
  pageY: number
}

export const useMeasure = ({ ref }: { ref: MutableRefObject<any> }) => {
  const [position, setPosition] = useState<null | Position>(null)

  useEffect(() => {
    ref.current?.measure(
      (x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
        setPosition({
          x,
          y,
          width,
          height,
          pageX,
          pageY,
        })
      },
      () => {
        console.error("measurement failed")
      }
    )
  }, [JSON.stringify(position)])

  return { ...position }
}
