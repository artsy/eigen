import { Flex, Image, Pill, Text } from "@artsy/palette-mobile"
import { SellWorkCard_artwork$key } from "__generated__/SellWorkCard_artwork.graphql"
import { getSellChannel } from "app/Scenes/Sell/utils/getSellChannel"
import { ResaleSubmissionWithChannel } from "app/Scenes/Sell/utils/resaleSubmission"
import { graphql, useFragment } from "react-relay"

const THUMBNAIL_SIZE = 80

interface SellWorkCardProps {
  artwork: SellWorkCard_artwork$key
  resaleSubmission: ResaleSubmissionWithChannel
}

export const SellWorkCard: React.FC<SellWorkCardProps> = ({ artwork, resaleSubmission }) => {
  const { artistNames, title, date, image } = useFragment(fragment, artwork)
  const channel = getSellChannel(resaleSubmission.channel)
  const status =
    channel.kind === "AUCTION"
      ? "To be reviewed by a specialist"
      : resaleSubmission.estimate && `Estimated Value: ${resaleSubmission.estimate}`

  return (
    <Flex flexDirection="row" gap={1}>
      {image?.squareURL ? (
        <Image src={image.squareURL} width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} />
      ) : (
        <Flex width={THUMBNAIL_SIZE} height={THUMBNAIL_SIZE} bg="mono10" />
      )}

      <Flex flex={1} gap={0.5}>
        <Text variant="sm-display">{artistNames}</Text>
        <Text variant="sm" color="mono60">
          {title}
          {date ? `, ${date}` : ""}
        </Text>
        {!!status && <Text variant="xs">{status}</Text>}
        <Flex flexDirection="row">
          <Pill variant="badge" disabled>
            {channel.name}
          </Pill>
        </Flex>
      </Flex>
    </Flex>
  )
}

const fragment = graphql`
  fragment SellWorkCard_artwork on Artwork {
    artistNames
    title
    date
    image(includeAll: false) {
      squareURL: url(version: "square")
    }
  }
`
