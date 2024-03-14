import { Flex, useSpace, BackButton } from "@artsy/palette-mobile"
import { ArtworkScreenHeader_artwork$key } from "__generated__/ArtworkScreenHeader_artwork.graphql"
import { useConditionalGoBack } from "app/system/newNavigation/useConditionalGoBack"
import { useIsStaging } from "app/utils/hooks/useIsStaging"
import { graphql, useFragment } from "react-relay"
import { ArtworkScreenHeaderCreateAlert } from "./ArtworkScreenHeaderCreateAlert"

const HEADER_HEIGHT = 44

interface ArtworkScreenHeaderProps {
  artwork: ArtworkScreenHeader_artwork$key
}

export const ArtworkScreenHeader: React.FC<ArtworkScreenHeaderProps> = ({ artwork }) => {
  const isStaging = useIsStaging()
  const space = useSpace()
  const goBack = useConditionalGoBack()

  const data = useFragment<ArtworkScreenHeader_artwork$key>(ArtworkScreenHeader_artwork, artwork)

  return (
    <Flex
      height={HEADER_HEIGHT}
      justifyContent="space-between"
      alignItems="center"
      flexDirection="row"
      px={2}
      accessibilityRole="header"
      accessibilityLabel="Artwork page header"
      {...(!!isStaging && {
        borderBottomWidth: 2,
        borderBottomColor: "devpurple",
      })}
    >
      <Flex>
        <BackButton
          onPress={goBack}
          hitSlop={{
            top: space(2),
            left: space(2),
            right: space(2),
            bottom: space(2),
          }}
        />
      </Flex>

      <Flex flexDirection="row" alignItems="center">
        <ArtworkScreenHeaderCreateAlert artworkRef={data} />
      </Flex>
    </Flex>
  )
}

const ArtworkScreenHeader_artwork = graphql`
  fragment ArtworkScreenHeader_artwork on Artwork {
    ...ArtworkScreenHeaderCreateAlert_artwork
  }
`
