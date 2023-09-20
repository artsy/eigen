import { Flex, Screen, Text } from "@artsy/palette-mobile"
import { ArtistBioQuery } from "__generated__/ArtistBioQuery.graphql"
import { goBack } from "app/system/navigation/navigate"
import { Suspense } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"
interface ArtistBioScreenProps {
  artistID: string
}

export const ArtistBio: React.FC<ArtistBioScreenProps> = (props) => {
  const { artist } = useLazyLoadQuery<ArtistBioQuery>(ArtistBioScreenQuery, {
    artistID: props.artistID,
  })

  if (!artist) {
    return null
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} title={artist.name!} />
      <Screen.Body>
        <Text>{artist?.biographyBlurb?.text}</Text>
      </Screen.Body>
    </Screen>
  )
}

export const ArtistBioScreen: React.FC<ArtistBioScreenProps> = (props) => {
  return (
    <Suspense
      fallback={
        <Flex
          flex={1}
          justifyContent="center"
          alignItems="center"
          testID="ArtistBioScreenPlaceholder"
        >
          <Text>Loading...</Text>
        </Flex>
      }
    >
      <ArtistBio {...props} />
    </Suspense>
  )
}

export const ArtistBioScreenQuery = graphql`
  query ArtistBioQuery($artistID: String!) {
    artist(id: $artistID) {
      name
      biographyBlurb(format: PLAIN, partnerBio: false) {
        text
      }
    }
  }
`
