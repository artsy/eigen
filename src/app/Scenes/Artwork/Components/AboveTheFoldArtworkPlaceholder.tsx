import { Spacer, Flex, useSpace, Join } from "@artsy/palette-mobile"
import { useImagePlaceholder } from "app/Scenes/Artwork/helpers"
import { PlaceholderBox, PlaceholderText, RandomNumberGenerator } from "app/utils/placeholders"
import { times } from "lodash"
import { useMemo } from "react"
import { Blurhash } from "react-native-blurhash"

interface AboveTheFoldPlaceholderProps {
  artworkID?: string
}

const ArtworkActionsPlaceholder = () => {
  const space = useSpace()

  return (
    <Flex flexDirection="row" justifyContent="center">
      {times(3).map((index) => (
        <PlaceholderBox
          key={`auction-${index}`}
          width={50}
          height={18}
          marginHorizontal={space(1)}
        />
      ))}
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
    <Flex flex={1}>
      {/* Header */}
      <Flex height={44} px={2} alignItems="center" flexDirection="row">
        <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="space-between">
          <PlaceholderBox width={20} height={20} />

          <Flex flexDirection="row" alignItems="center">
            <PlaceholderBox width={105} height={25} />
          </Flex>
        </Flex>
      </Flex>

      {/* Artwork thumbnail */}
      <Flex mx="auto" pt={2}>
        {blurhash ? (
          <Flex backgroundColor="black10" height={height} width={width}>
            <Blurhash blurhash={blurhash} style={{ flex: 1 }} />
          </Flex>
        ) : (
          <PlaceholderBox width={width} height={height} />
        )}
      </Flex>

      <Spacer y={1} />

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
