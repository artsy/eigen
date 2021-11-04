import { Pill, useSpace } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { PillType } from "../types"

export interface SearchPillsProps {
  loading: boolean
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
}

export const SearchPills = React.forwardRef<ScrollView, SearchPillsProps>((props, ref) => {
  const { loading, pills, onPillPress, isSelected } = props
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
        const { name, displayName } = pill
        const selected = isSelected(pill)
        const disabledWithStyles = (!!pill.disabled || !!loading) && pill.name !== "TOP"

        return (
          <Pill
            mr={1}
            key={name}
            accessibilityState={{
              selected,
            }}
            rounded
            selected={selected}
            disabled={disabledWithStyles || selected}
            applyDisabledStyles={disabledWithStyles}
            onPress={() => onPillPress(pill)}
          >
            {displayName}
          </Pill>
        )
      })}
    </ScrollView>
  )
})
