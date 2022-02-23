import { Pill, useSpace } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { PillType } from "../types"

export interface SearchPillsProps {
  loading?: boolean
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
}

export const SearchPills = React.forwardRef<ScrollView, SearchPillsProps>((props, ref) => {
  const { loading = false, pills, onPillPress, isSelected } = props
  const space = useSpace()

  return (
    <ScrollView
      accessible
      accessibilityLabel="Scroll view for result type filter options"
      ref={ref}
      horizontal
      contentContainerStyle={{ paddingLeft: space(1.5), paddingRight: space(1) }}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {pills.map((pill) => {
        const { key, displayName } = pill
        const selected = isSelected(pill)
        const disabled = !!pill.disabled || !!loading || !!selected

        return (
          <Pill
            mr={1}
            key={key}
            accessibilityState={{ selected, disabled }}
            rounded
            selected={selected}
            disabled={disabled}
            onPress={() => onPillPress(pill)}
          >
            {displayName}
          </Pill>
        )
      })}
    </ScrollView>
  )
})
