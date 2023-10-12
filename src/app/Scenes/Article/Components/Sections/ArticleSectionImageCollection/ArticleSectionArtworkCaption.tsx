import { Flex, Text, Touchable } from "@artsy/palette-mobile"
import { ArticleSectionArtworkCaption_artwork$key } from "__generated__/ArticleSectionArtworkCaption_artwork.graphql"
import { navigate } from "app/system/navigation/navigate"
import { useFragment, graphql } from "react-relay"

interface ArticleSectionArtworkCaptionProps {
  artwork: ArticleSectionArtworkCaption_artwork$key
}

export const ArticleSectionArtworkCaption: React.FC<ArticleSectionArtworkCaptionProps> = ({
  artwork,
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
    <Flex px={2} py={1}>
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
        <Text variant="sm-display" color="black60">
          <Text variant="sm-display" color="black60" italic>
            {data.title}
          </Text>
          {!!data.date && `, ${data.date}`}
        </Text>
      </Touchable>

      <Touchable onPress={() => handleOnNavigate(data.partner?.href)}>
        <Text variant="xs" color="black60">
          {data.partner?.name}
        </Text>
      </Touchable>

      {!!data.saleMessage && (
        <Text variant="xs" weight="medium">
          {data.saleMessage}
        </Text>
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
