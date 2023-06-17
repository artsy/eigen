import { Flex, Join, Spacer } from "@artsy/palette-mobile"
import { FilterArtworksInput } from "__generated__/ArtistAboveTheFoldQuery.graphql"
import { ConfirmationScreenCriteriaQuery } from "__generated__/ConfirmationScreenCriteriaQuery.graphql"
import { Pill } from "app/Components/Pill"
import { MatchingArtworks } from "app/Scenes/SavedSearchAlert/Components/ConfirmationScreenArtworks"
import { graphql, useLazyLoadQuery } from "react-relay"

const criteriaQuery = graphql`
  query ConfirmationScreenCriteriaQuery($searchCriteriaID: ID!) {
    me {
      savedSearch(id: $searchCriteriaID) {
        labels {
          displayValue
          field
          value
        }
      }
    }
  }
`

export const ConfirmationScreenCriteria: React.FC<{ searchCriteriaID: string }> = ({
  searchCriteriaID,
}) => {
  const data = useLazyLoadQuery<ConfirmationScreenCriteriaQuery>(criteriaQuery, {
    searchCriteriaID,
  })

  if (!data?.me?.savedSearch?.labels) {
    return null
  }

  const labels = data.me.savedSearch.labels

  // TODO: does this sort of logic exist elsewhere?
  const artistIDs = labels
    .filter((label) => label.field === "artistIDs")
    .map((label) => label.value)

  const input: FilterArtworksInput = { artistIDs }

  return (
    <>
      <Flex flexDirection="row" flexWrap="wrap">
        <Join separator={<Spacer x={1} />}>
          {labels.map((label, index) => {
            return (
              <Pill key={`filter-label-${index}`} block>
                {label.displayValue}
              </Pill>
            )
          })}
        </Join>
      </Flex>
      <Spacer y={2} />
      <MatchingArtworks input={input} />
    </>
  )
}
