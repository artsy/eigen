import { Button, Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ArticleSectionArtworkCaption_artwork$key } from "__generated__/ArticleSectionArtworkCaption_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionArtworkCaptionProps {
  artwork: ArticleSectionArtworkCaption_artwork$key
  showViewArtworkCTA?: boolean
}

export const ArticleSectionArtworkCaption: React.FC<ArticleSectionArtworkCaptionProps> = ({
  artwork,
  showViewArtworkCTA,
}) => {
  const data = useFragment(fragment, artwork)

  if (!data) {
    return null
  }

  const handleOnNavigate = (href: string | null = null) => {
    if (href) {
      navigate(href)
    }
  }

  return (
    <Flex pr={2}>
      {data.artists?.map((artist, i) => {
        if (!artist || !artist.href || !artist.name) return null

        return (
          <Touchable key={i} onPress={() => handleOnNavigate(artist.href)}>
            <Text variant="sm-display">
              {artist.name}
              {i !== data.artists!.length - 1 && ", "}
            </Text>
          </Touchable>
        )
      })}

      <Touchable onPress={() => handleOnNavigate(data.href)}>
        <Text variant="sm-display" color="mono60">
          <Text variant="sm-display" color="mono60" italic>
            {data.title}
          </Text>
          {!!data.date && `, ${data.date}`}
        </Text>
      </Touchable>

      <Touchable onPress={() => handleOnNavigate(data.partner?.href)}>
        <Text variant="xs" color="mono60">
          {data.partner?.name}
        </Text>
      </Touchable>

      {!!data.saleMessage && (
        <Text variant="xs" weight="medium">
          {data.saleMessage}
        </Text>
      )}

      {!!showViewArtworkCTA && (
        <Button mt={1} size="small" variant="outline" onPress={() => handleOnNavigate(data.href)}>
          View Artwork
        </Button>
      )}
    </Flex>
  )
}

const fragment = graphql`
  fragment ArticleSectionArtworkCaption_artwork on Artwork {
    internalID
    href
    title
    date
    saleMessage
    artists(shallow: true) {
      id
      href
      name
    }
    partner {
      name
      href
    }
  }
`
