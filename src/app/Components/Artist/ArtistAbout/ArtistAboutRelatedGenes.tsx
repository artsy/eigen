import { Pill, Spacer, Text, useSpace } from "@artsy/palette-mobile"
import { ArtistAboutRelatedGenes_genes$key } from "__generated__/ArtistAboutRelatedGenes_genes.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Fragment } from "react"
import { ScrollView } from "react-native"
import { isTablet } from "react-native-device-info"
import { graphql, useFragment } from "react-relay"

interface ArtistAboutRelatedGenesProps {
  genes: ArtistAboutRelatedGenes_genes$key
}

const MAX_WIDTH = 800
const MAX_GENES = 24

export const ArtistAboutRelatedGenes: React.FC<ArtistAboutRelatedGenesProps> = ({ genes }) => {
  const data = useFragment(query, genes)
  const space = useSpace()

  if (!data) {
    return null
  }

  return (
    <>
      <Text variant="sm-display" pb={4} px={2}>
        Related Categories
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{
          maxWidth: isTablet() ? "100%" : MAX_WIDTH,
          flexWrap: "wrap",
          marginHorizontal: space(2),
        }}
      >
        {data.slice(0, MAX_GENES).map(({ name, href, internalID }) => (
          <Fragment key={`gene-${internalID}`}>
            <RouterLink hasChildTouchable to={href}>
              <Pill variant="default">{name}</Pill>
            </RouterLink>
            <Spacer x={1} y={4} />
          </Fragment>
        ))}
      </ScrollView>
    </>
  )
}

const query = graphql`
  fragment ArtistAboutRelatedGenes_genes on Gene @relay(plural: true) {
    internalID
    href
    name
  }
`
