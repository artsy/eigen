import { OnboardingGeneQuery } from "__generated__/OnboardingGeneQuery.graphql"
import { extractNodes } from "app/utils/extractNodes"
import { Screen, Text } from "palette"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

interface OnboardingGeneProps {
  id: string
  description: string
}

const OnboardingGene: React.FC<OnboardingGeneProps> = ({ id, description }) => {
  const queryData = useLazyLoadQuery<OnboardingGeneQuery>(OnboardingGeneScreenQuery, {
    id,
  })

  console.warn(extractNodes(queryData.gene?.artworks))
  return (
    <Screen>
      <Screen.Body>
        <Text variant="sm">{description}</Text>
      </Screen.Body>
    </Screen>
  )
}

export const OnboardingGeneScreen: React.FC<OnboardingGeneProps> = (props) => (
  <Suspense
    fallback={
      <Text variant="xl" color="black100">
        Loading..
      </Text>
    }
  >
    <OnboardingGene {...props} />
  </Suspense>
)

const OnboardingGeneScreenQuery = graphql`
  query OnboardingGeneQuery($id: String!) {
    gene(id: $id) {
      name
      artworks: filterArtworksConnection(
        first: 100
        page: 1
        sort: "-decayed_merch"
        height: "*-*"
        width: "*-*"
        priceRange: "*-*"
        marketable: true
        offerable: true
        inquireableOnly: true
        forSale: true
      ) {
        edges {
          node {
            internalID
            # ...GridItem_artwork
          }
        }
      }
      # ...FollowGeneButton_gene
    }
  }
`
