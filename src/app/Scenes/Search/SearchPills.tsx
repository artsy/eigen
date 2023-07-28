import { useSpace, Pill } from "@artsy/palette-mobile"
import { SearchPills_viewer$key } from "__generated__/SearchPills_viewer.graphql"
import { TOP_PILL } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

export interface SearchPillsProps {
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
  viewer: SearchPills_viewer$key
  isLoading: boolean
}

export const SearchPills = React.forwardRef<ScrollView, SearchPillsProps>(
  ({ pills, onPillPress, isSelected, viewer }, ref) => {
    const space = useSpace()

    const data = useFragment<SearchPills_viewer$key>(SearchPillsQuery, viewer)

    const aggregation = data?.searchConnection?.aggregations?.[0]

    const isPillDisabled = (key: string) => {
      if (key === TOP_PILL.key) {
        return false
      }

      return !aggregation?.counts?.find((agg) => agg?.name === key)
    }

    return (
      <ScrollView
        accessible
        accessibilityLabel="Scroll view for result type filter options"
        ref={ref}
        horizontal
        contentContainerStyle={{ paddingLeft: space(2), paddingRight: space(1) }}
        showsHorizontalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {pills.map((pill) => {
          const { key, displayName } = pill
          const selected = isSelected(pill)
          const disabled = isPillDisabled(key)

          return (
            <Pill
              mr={1}
              key={key}
              accessibilityState={{ selected, disabled }}
              variant="search"
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
  }
)

export const SearchPillsQuery = graphql`
  fragment SearchPills_viewer on Viewer
  @argumentDefinitions(term: { type: "String!", defaultValue: "" }) {
    searchConnection(first: 0, mode: AUTOSUGGEST, query: $term, aggregations: [TYPE]) {
      aggregations {
        counts {
          count
          name
        }
      }
    }
  }
`
