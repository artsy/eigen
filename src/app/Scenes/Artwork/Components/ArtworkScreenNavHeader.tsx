import { Flex } from "@artsy/palette-mobile"
import { ArtworkScreenNavHeader_artwork$key } from "__generated__/ArtworkScreenNavHeader_artwork.graphql"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { graphql, useFragment } from "react-relay"
import { ArtworkScreenHeaderCreateAlert } from "./ArtworkScreenHeaderCreateAlert"

const HEADER_HEIGHT = 44

interface ArtworkScreenNavHeaderProps {
  artwork: ArtworkScreenNavHeader_artwork$key
}

export const ArtworkScreenNavHeader: React.FC<ArtworkScreenNavHeaderProps> = ({ artwork }) => {
  const isStaging = useIsStaging()

  const data = useFragment<ArtworkScreenNavHeader_artwork$key>(
    ArtworkScreenNavHeader_artwork,
    artwork
  )

  return (
    <Flex
      height={HEADER_HEIGHT}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      accessibilityRole="header"
      accessibilityLabel="Artwork page header"
      {...(!!isStaging && {
        borderBottomWidth: 2,
        borderBottomColor: "devpurple",
      })}
    >
      <ArtworkScreenHeaderCreateAlert artworkRef={data} />
    </Flex>
  )
}

const ArtworkScreenNavHeader_artwork = graphql`
  fragment ArtworkScreenNavHeader_artwork on Artwork {
    ...ArtworkScreenHeaderCreateAlert_artwork
  }
`
