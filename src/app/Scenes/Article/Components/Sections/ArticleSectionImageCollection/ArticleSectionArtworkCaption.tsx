import { Button, Flex, Text } from "@artsy/palette-mobile"
import { ArticleSectionArtworkCaption_artwork$key } from "__generated__/ArticleSectionArtworkCaption_artwork.graphql"
import { RouterLink } from "app/system/navigation/RouterLink"
import { graphql, useFragment } from "react-relay"

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

  return (
    <Flex pr={2}>
      {data.artists?.map((artist, i) => {
        if (!artist || !artist.href || !artist.name) return null

        return (
          <RouterLink key={i} to={artist.href}>
            <Text variant="sm-display">
              {artist.name}
              {i !== data.artists!.length - 1 && ", "}
            </Text>
          </RouterLink>
        )
      })}

      <RouterLink to={data.href}>
        <Text variant="sm-display" color="mono60">
          <Text variant="sm-display" color="mono60" italic>
            {data.title}
          </Text>
          {!!data.date && `, ${data.date}`}
        </Text>
      </RouterLink>

      <RouterLink to={data.partner?.href}>
        <Text variant="xs" color="mono60">
          {data.partner?.name}
        </Text>
      </RouterLink>

      {!!data.saleMessage && (
        <Text variant="xs" weight="medium">
          {data.saleMessage}
        </Text>
      )}

      {!!showViewArtworkCTA && (
        <RouterLink hasChildTouchable to={data.href}>
          <Button mt={1} size="small" variant="outline">
            View Artwork
          </Button>
        </RouterLink>
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
