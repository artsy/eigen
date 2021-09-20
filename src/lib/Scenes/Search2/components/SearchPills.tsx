import { Pill, useSpace } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { PillType } from "../types"

export interface SearchPillsProps {
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
}

export const SearchPills: React.FC<SearchPillsProps> = (props) => {
  const { pills, onPillPress, isSelected } = props
  const space = useSpace()

  return (
    <ScrollView
      horizontal
      contentContainerStyle={{ paddingHorizontal: space(2) }}
      showsHorizontalScrollIndicator={false}
    >
      {pills.map((pill) => {
        const { name, displayName } = pill
        const selected = isSelected(pill)

        return (
          <Pill
            mr={1}
            key={name}
            accessibilityState={{
              selected,
            }}
            rounded
            selected={selected}
            onPress={() => onPillPress(pill)}
          >
            {displayName}
          </Pill>
        )
      })}
    </ScrollView>
  )
}
