import { Flex, ImageSkeleton, Join, Spacer } from "@artsy/palette-mobile"
import { CARD_HEIGHT } from "app/Scenes/Artwork/Components/ArtworkHeader"
import { useImagePlaceholder } from "app/Scenes/Artwork/helpers"
import { PlaceholderBox, PlaceholderText, RandomNumberGenerator } from "app/utils/placeholders"
import { times } from "lodash"
import { useMemo } from "react"

interface AboveTheFoldPlaceholderProps {
  artworkID?: string
}

const ArtworkActionsPlaceholder = () => {
  return (
    <Flex flexDirection="row" justifyContent="center">
      <PlaceholderBox width={200} height={22} />
    </Flex>
  )
}

const ArtworkDetailPlaceholderText = () => {
  const length = useMemo(() => {
    const rng = new RandomNumberGenerator(Math.random())

    return rng.next({
      from: 0.2,
      to: 1,
    })
  }, [])

  return <PlaceholderText flex={length} height={20} />
}

const ArtworkDetailsPlaceholder = () => {
  return (
    <Join separator={<Spacer y={1} />}>
      {times(10).map((index) => (
        <Flex key={`detail-row-${index}`} flexDirection="row">
          <PlaceholderText width={128} height={20} />
          <Spacer x={2} />
          <ArtworkDetailPlaceholderText />
        </Flex>
      ))}
    </Join>
  )
}

export const AboveTheFoldPlaceholder: React.FC<AboveTheFoldPlaceholderProps> = ({ artworkID }) => {
  const { width, height, blurhash } = useImagePlaceholder(artworkID)

  return (
    <Flex flex={1} pt={2}>
      {/* Artwork thumbnail */}
      <Flex mx="auto" py={2} height={CARD_HEIGHT} justifyContent="center">
        <ImageSkeleton dimensions={{ width, height }} blurhash={blurhash} />
      </Flex>

      <Spacer y={4} />

      {/* Content */}
      <Flex px={2}>
        {/* save/share buttons */}
        <ArtworkActionsPlaceholder />

        <Spacer y={4} />

        {/* Artist name */}
        <PlaceholderText width={100} height={30} />

        {/* Artwork tombstone details */}
        <PlaceholderText width={250} height={26} />

        <Spacer y={4} />

        {/* Artwork details */}
        <ArtworkDetailsPlaceholder />
      </Flex>
    </Flex>
  )
}
