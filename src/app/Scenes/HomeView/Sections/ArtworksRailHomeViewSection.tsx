import { Flex } from "@artsy/palette-mobile"
import { ArtworksRailHomeViewSectionQuery } from "__generated__/ArtworksRailHomeViewSectionQuery.graphql"
import { ArtworksRailHomeViewSection_section$key } from "__generated__/ArtworksRailHomeViewSection_section.graphql"
import {
  LargeArtworkRail,
  LargeArtworkRailPlaceholder,
} from "app/Components/ArtworkRail/LargeArtworkRail"
import { SectionTitle } from "app/Components/SectionTitle"
import { SectionT } from "app/Scenes/HomeView/Sections/Section"
import { navigate } from "app/system/navigation/navigate"
import { extractNodes } from "app/utils/extractNodes"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { graphql, useFragment, useLazyLoadQuery } from "react-relay"

interface ArtworksRailHomeViewSectionProps {
  section: ArtworksRailHomeViewSection_section$key
}

export const ArtworksRailHomeViewSection: React.FC<ArtworksRailHomeViewSectionProps> = ({
  section,
}) => {
  const data = useFragment(fragment, section)

  const artworks = extractNodes(data.artworksConnection)

  if (!data.component || !artworks || artworks.length === 0) {
    return null
  }

  const { title, href } = data.component

  const handleOnArtworkPress = (artwork: any, _position: any) => {
    navigate(artwork.href)
  }

  return (
    <Flex>
      <Flex pl={2} pr={2}>
        <SectionTitle title={title} {...(href ? { onPress: () => navigate(href) } : {})} />
      </Flex>
      <LargeArtworkRail
        artworks={artworks}
        onPress={handleOnArtworkPress}
        showSaveIcon
        {...(href ? { onMorePress: () => navigate(href) } : {})}
      />
    </Flex>
  )
}

const artworksRailHomeViewSectionQuery = graphql`
  query ArtworksRailHomeViewSectionQuery($id: String!) {
    homeView {
      section(id: $id) {
        ...ArtworksRailHomeViewSection_section
      }
    }
  }
`

interface ArtworksRailHomeViewSectionQueryRendererProps {
  section: SectionT
}

export const ArtworksRailHomeViewSectionQueryRenderer = withSuspense(
  (props: ArtworksRailHomeViewSectionQueryRendererProps) => {
    const data = useLazyLoadQuery<ArtworksRailHomeViewSectionQuery>(
      artworksRailHomeViewSectionQuery,
      {
        id: props.section.internalID as string,
      }
    )

    if (!data?.homeView?.section) {
      return null
    }

    return <ArtworksRailHomeViewSection section={data.homeView.section} />
  },
  () => (
    <Flex flexDirection="row">
      <LargeArtworkRailPlaceholder />
    </Flex>
  )
)

const fragment = graphql`
  fragment ArtworksRailHomeViewSection_section on ArtworksRailHomeViewSection {
    id
    component {
      href
      title
    }

    artworksConnection(first: 10) {
      edges {
        node {
          ...LargeArtworkRail_artworks
        }
      }
    }
  }
`
