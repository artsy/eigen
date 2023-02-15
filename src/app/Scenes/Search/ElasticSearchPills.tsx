import { useSpace } from "@artsy/palette-mobile"
import { ElasticSearchPills_viewer$key } from "__generated__/ElasticSearchPills_viewer.graphql"
import { TOP_PILL } from "app/Scenes/Search/constants"
import { PillType } from "app/Scenes/Search/types"
import { Pill } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { graphql, useFragment } from "react-relay"

export interface ElasticSearchPillsProps {
  pills: PillType[]
  onPillPress: (pill: PillType) => void
  isSelected: (pill: PillType) => boolean
  viewer: ElasticSearchPills_viewer$key
  isLoading: boolean
}

export const ElasticSearchPills = React.forwardRef<ScrollView, ElasticSearchPillsProps>(
  ({ pills, onPillPress, isSelected, viewer }, ref) => {
    const space = useSpace()

    const data = useFragment<ElasticSearchPills_viewer$key>(ElasticSearchPillsQuery, viewer)

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
          const disabled = !!selected || isPillDisabled(key)

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
  }
)

export const ElasticSearchPillsQuery = graphql`
  fragment ElasticSearchPills_viewer on Viewer
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
