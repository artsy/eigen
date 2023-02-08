import { Spacer } from "@artsy/palette-mobile"
import { CuratedCollections_collections$key } from "__generated__/CuratedCollections_collections.graphql"
import { CardRailFlatList } from "app/Components/Home/CardRailFlatList"
import { SectionTitle } from "app/Components/SectionTitle"
import { compact } from "lodash"
import { Box, BoxProps } from "palette"
import { graphql, useFragment } from "react-relay"
import { CuratedCollectionItem } from "./CuratedCollectionItem"

interface CuratedCollectionsProps extends BoxProps {
  collections: CuratedCollections_collections$key
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({
  collections,
  ...boxProps
}) => {
  const data = useFragment(CuratedCollectionsFragment, collections)
  const filledCollections = compact(data.collections)

  if (filledCollections.length === 0) {
    return null
  }

  return (
    <Box {...boxProps}>
      <Box mx={2}>
        <SectionTitle title="Artsy Collections" />
      </Box>

      <CardRailFlatList
        data={filledCollections}
        keyExtractor={(node) => node.internalID}
        renderItem={({ item, index }) => {
          return <CuratedCollectionItem collection={item} position={index} />
        }}
        ItemSeparatorComponent={() => <Spacer x={1} />}
      />
    </Box>
  )
}

const CuratedCollectionsFragment = graphql`
  fragment CuratedCollections_collections on Query {
    collections: curatedMarketingCollections(size: 5) {
      internalID
      ...CuratedCollectionItem_collection
    }
  }
`
