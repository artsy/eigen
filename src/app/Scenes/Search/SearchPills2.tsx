import { SearchPills2_viewer$key } from "__generated__/SearchPills2_viewer.graphql"
import { TOP_PILL } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import { Pill, useSpace } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

export interface SearchPillsProps {
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
  viewer: SearchPills2_viewer$key
}

export const SearchPills2 = React.forwardRef<ScrollView, SearchPillsProps>((props, ref) => {
  const { pills, onPillPress, isSelected, viewer } = props
  const space = useSpace()

  const data = useFragment<SearchPills2_viewer$key>(SearchPillsQuery, viewer)

  const aggregation = data?.searchConnection?.aggregations?.[0]

  return (
    <ScrollView
      accessible
      accessibilityLabel="Scroll view for result type filter options"
      ref={ref}
      horizontal
      contentContainerStyle={{ paddingLeft: space("2"), paddingRight: space("1") }}
      showsHorizontalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {pills.map((pill) => {
        const { key, displayName } = pill
        const isPillDisabled =
          !aggregation?.counts?.find((agg) => agg?.name === key) && key !== TOP_PILL.key
        const selected = isSelected(pill)
        const disabled = !!selected || isPillDisabled

        return (
          <Pill
            mr={1}
            key={key}
            accessibilityState={{ selected, disabled }}
            rounded
            selected={selected}
            disabled={disabled}
            onPress={() => onPillPress(pill)}
            block
          >
            {displayName}
          </Pill>
        )
      })}
    </ScrollView>
  )
})

export const SearchPillsQuery = graphql`
  fragment SearchPills2_viewer on Viewer
  @argumentDefinitions(term: { type: "String!", defaultValue: "" }) {
    searchConnection(first: 1, query: $term, aggregations: [TYPE]) {
      aggregations {
        counts {
          count
          name
        }
      }
    }
  }
`
