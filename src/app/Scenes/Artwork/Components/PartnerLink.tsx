import { Text, LinkText } from "@artsy/palette-mobile"
import { PartnerLink_artwork$key } from "__generated__/PartnerLink_artwork.graphql"
import { navigateToPartner } from "app/system/navigation/navigate"
import { graphql, useFragment } from "react-relay"

interface PartnerLinkProps {
  artwork: PartnerLink_artwork$key
}

export const PartnerLink: React.FC<PartnerLinkProps> = ({ artwork }) => {
  const artworkData = useFragment(artworkFragment, artwork)

  if (!artworkData?.partner) {
    return null
  }

  const { name, href, isLinkable } = artworkData.partner

  if (isLinkable && !!href) {
    return (
      <LinkText
        accessibilityRole="link"
        accessibilityLabel={name ?? ""}
        accessibilityHint={`Visit ${name} page`}
        onPress={() => navigateToPartner(href)}
      >
        {name}
      </LinkText>
    )
  }

  return <Text testID="non linkable partner">{name}</Text>
}

const artworkFragment = graphql`
  fragment PartnerLink_artwork on Artwork {
    partner @required(action: NONE) {
      name
      href
      isLinkable
    }
  }
`
