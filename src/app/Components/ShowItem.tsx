import { Button, Flex, Image, Text } from "@artsy/palette-mobile"
import { ShowItem_show$key } from "__generated__/ShowItem_show.graphql"
import { ShowFollowButton } from "app/Components/ShowFollowButton"
import { RouterLink } from "app/system/navigation/RouterLink"
import { hrefForPartialShow } from "app/utils/router"
import { graphql, useFragment } from "react-relay"

const DEFAULT_CELL_WIDTH = 335

interface ShowItemProps {
  displayViewShowButton?: boolean
  shouldHideFollowButton?: boolean
  show: ShowItem_show$key
}

export const ShowItem: React.FC<ShowItemProps> = ({
  displayViewShowButton = false,
  shouldHideFollowButton = false,
  show,
}) => {
  const data = useFragment(showGraphql, show)

  if (!data) {
    return null
  }

  const href = hrefForPartialShow({
    href: data.href,
    is_fair_booth: data.isFairBooth,
    slug: data.slug,
  })

  return (
    <RouterLink to={href} style={{ width: DEFAULT_CELL_WIDTH }} testID="show-item-visit-show-link">
      <Flex position="relative">
        <Image
          testID="show-cover"
          src={data.coverImage?.url ?? ""}
          blurhash={data.coverImage?.blurhash}
          aspectRatio={1.3}
          width={DEFAULT_CELL_WIDTH}
        />
        {!shouldHideFollowButton && (
          <Flex position="absolute" top={1} right={1}>
            <ShowFollowButton show={data} />
          </Flex>
        )}
      </Flex>

      <Text variant="lg-display" mt={1}>
        {data.name}
      </Text>
      <Text variant="sm-display">{data.partner?.name}</Text>
      {!!data.exhibitionPeriod && (
        <Text variant="sm-display" color="mono60">
          {data.exhibitionPeriod}
        </Text>
      )}

      {!!displayViewShowButton && (
        <RouterLink hasChildTouchable to={href}>
          <Button my={2}>View Show</Button>
        </RouterLink>
      )}
    </RouterLink>
  )
}

const showGraphql = graphql`
  fragment ShowItem_show on Show {
    ...ShowFollowButton_show
    slug
    href
    name
    isFairBooth
    partner {
      ... on Partner {
        name
      }
      ... on ExternalPartner {
        name
      }
    }
    exhibitionPeriod(format: SHORT)
    coverImage {
      url(version: "large")
      blurhash
    }
  }
`
