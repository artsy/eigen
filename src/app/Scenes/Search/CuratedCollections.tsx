import { CuratedCollections_collections$key } from "__generated__/CuratedCollections_collections.graphql"
import { SectionTitle } from "app/Components/SectionTitle"
import { Join, Spacer } from "palette"
import { graphql, useFragment } from "react-relay"
import { CuratedCollectionItem } from "./CuratedCollectionItem"

interface CuratedCollectionsProps {
  collections: CuratedCollections_collections$key
}

export const CuratedCollections: React.FC<CuratedCollectionsProps> = ({ collections }) => {
  const data = useFragment(CuratedCollectionsFragment, collections)

  return (
    <>
      <SectionTitle title="Artsy Curated Collections" />

      <Join separator={<Spacer mb={2} />}>
        {data.collections?.map((collection: any) => (
          <CuratedCollectionItem key={collection.internalID} collection={collection} />
        ))}
      </Join>
    </>
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
