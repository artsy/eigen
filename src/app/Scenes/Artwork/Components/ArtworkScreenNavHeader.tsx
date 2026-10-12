import { Flex } from "@artsy/palette-mobile"
import { ArtworkScreenNavHeader_artwork$key } from "__generated__/ArtworkScreenNavHeader_artwork.graphql"
import { useEnvironmentColor } from "app/utils/hooks/useEnvironmentColor"
import { graphql, useFragment } from "react-relay"
import { ArtworkScreenHeaderCreateAlert } from "./ArtworkScreenHeaderCreateAlert"

const HEADER_HEIGHT = 44

interface ArtworkScreenNavHeaderProps {
  artwork: ArtworkScreenNavHeader_artwork$key
}

export const ArtworkScreenNavHeader: React.FC<ArtworkScreenNavHeaderProps> = ({ artwork }) => {
  const environmentColor = useEnvironmentColor()

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
      {...(!!environmentColor && {
        borderBottomWidth: 2,
        borderBottomColor: environmentColor,
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
