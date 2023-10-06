import { Pill, PillProps } from "@artsy/palette-mobile"
import { useState } from "react"
import useDebounce from "react-use/lib/useDebounce"

export const FillPill: React.FC<PillProps> = (props) => {
  const [selected, setSelected] = useState(props.selected)

  useDebounce(
    () => {
      props.onPress?.()
    },
    200,
    [props.selected]
  )

  return (
    <Pill {...props} mt={1} mr={1} selected={selected} onPress={() => setSelected(!selected)} />
  )
}
