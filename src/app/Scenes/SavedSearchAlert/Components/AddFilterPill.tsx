import { Pill, PillProps } from "@artsy/palette-mobile"
import { useEffect, useState } from "react"

export const SavedSearchFilterPill: React.FC<PillProps> = (props) => {
  const [selected, setSelected] = useState(props.selected)

  useEffect(() => {
    props.onPress?.()
  }, [selected])

  return (
    <Pill {...props} mt={1} mr={1} selected={selected} onPress={() => setSelected(!selected)} />
  )
}
