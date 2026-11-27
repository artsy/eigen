import { Flex, Text } from "@artsy/palette-mobile"
import { CVShow } from "app/Scenes/ArtistCV/utils/toCVRows"
import { RouterLink } from "app/system/navigation/RouterLink"
import { hrefForPartialShow } from "app/utils/router"

interface ArtistCVRowProps {
  show: CVShow
}

export const ArtistCVRow: React.FC<ArtistCVRowProps> = ({ show }) => {
  const content = (
    <Flex pl={2} mb={1}>
      <Text variant="sm">{show.name}</Text>
      {!!show.partner?.name && (
        <Text variant="xs" color="mono60">
          {show.partner.name}
        </Text>
      )}
    </Flex>
  )

  // Reference shows from the artist's CV have no Artsy page to open.
  if (!show.href) {
    return content
  }

  return <RouterLink to={hrefForPartialShow(show)}>{content}</RouterLink>
}
