import { CertificateIcon, Flex, LinkText, Text } from "@artsy/palette-mobile"
import { ArtworkAuthenticityCertificate_artwork$data } from "__generated__/ArtworkAuthenticityCertificate_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { createFragmentContainer, graphql } from "react-relay"

interface ArtworkAuthenticityCertificateProps {
  artwork: ArtworkAuthenticityCertificate_artwork$data
}

export const ArtworkAuthenticityCertificate: React.FC<ArtworkAuthenticityCertificateProps> = ({
  artwork,
}) => {
  const shouldRenderAuthenticityCertificate =
    artwork.hasCertificateOfAuthenticity && !artwork.isBiddable

  if (!shouldRenderAuthenticityCertificate) {
    return null
  }

  return (
    <>
      <Flex
        alignItems="center"
        data-testid="authenticity-certificate"
        flexDirection="row"
        alignContent="center"
      >
        <CertificateIcon mr={0.5} fill="mono60" height={25} width={25} />
        <Text color="mono60" variant="sm">
          Includes a{" "}
          <RouterLink to="/artwork-certificate-of-authenticity" hasChildTouchable>
            <LinkText color="mono60" variant="sm">
              Certificate of Authenticity
            </LinkText>
          </RouterLink>
        </Text>
      </Flex>
    </>
  )
}

export const ArtworkAuthenticityCertificateFragmentContainer = createFragmentContainer(
  ArtworkAuthenticityCertificate,
  {
    artwork: graphql`
      fragment ArtworkAuthenticityCertificate_artwork on Artwork {
        hasCertificateOfAuthenticity
        isBiddable
      }
    `,
  }
)
