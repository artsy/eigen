import { Pill, PillProps } from "@artsy/palette-mobile"
import { useEffect, useState } from "react"
import useDebounce from "react-use/lib/useDebounce"

export const SavedSearchFilterPill: React.FC<PillProps> = (props) => {
  const [selected, setSelected] = useState(props.selected)

  useDebounce(
    () => {
      if (selected !== props.selected) {
        props.onPress?.()
      }
    },
    __TEST__ ? 0 : 200,
    [selected]
  )

  // Make sure that the selected state is in sync with the state in the fitler store
  useEffect(() => {
    if (props.selected !== selected) {
      setSelected(props.selected)
    }
  }, [props.selected])

  return (
    <Pill {...props} mt={1} mr={0.5} selected={selected} onPress={() => setSelected(!selected)} />
  )
}
