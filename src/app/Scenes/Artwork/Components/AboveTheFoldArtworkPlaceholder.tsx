import { Spacer, Flex, useSpace } from "@artsy/palette-mobile"
import { useImagePlaceholderDimensions } from "app/Scenes/Artwork/helpers"
import { useFeatureFlag } from "app/store/GlobalStore"
import { PlaceholderBox, PlaceholderText, RandomNumberGenerator } from "app/utils/placeholders"
import { times } from "lodash"
import { Join, Separator } from "palette"
import { useMemo } from "react"

interface AboveTheFoldPlaceholderProps {
  artworkID?: string
}

const ArtworkActionsPlaceholder = () => {
  const space = useSpace()

  return (
    <Flex flexDirection="row" justifyContent="center">
      {times(2).map((index) => (
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

const RedesignedAboveTheFoldPlaceholder: React.FC<AboveTheFoldPlaceholderProps> = ({
  artworkID,
}) => {
  const space = useSpace()
  const { width, height } = useImagePlaceholderDimensions(artworkID)

  return (
    <Flex flex={1}>
      {/* Header */}
      <Flex height={44} px={2} alignItems="center" flexDirection="row">
        <Flex flex={1} flexDirection="row" alignItems="center" justifyContent="space-between">
          <PlaceholderBox width={20} height={20} />

          <Flex flexDirection="row" alignItems="center">
            <PlaceholderBox width={105} height={25} marginRight={space(1)} />
            <PlaceholderBox width={105} height={25} />
          </Flex>
        </Flex>
      </Flex>

      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
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

const CurrentAboveTheFoldPlaceholder: React.FC<AboveTheFoldPlaceholderProps> = ({ artworkID }) => {
  const space = useSpace()
  const { width, height } = useImagePlaceholderDimensions(artworkID)

  return (
    <Flex pt={6} pb={2}>
      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
      </Flex>
      <Spacer y={2} />

      {/* Content */}
      <Flex px={2} flex={1}>
        {/* save/share buttons */}
        <Flex flexDirection="row" justifyContent="center" alignItems="center" height={30}>
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
        </Flex>
        <Spacer y={4} />

        {/* Artist name */}
        <PlaceholderText width={100} height={26} />

        {/* Artwork tombstone details */}
        <PlaceholderText width={250} height={26} marginBottom={0} />

        {/* more junk */}
        <Spacer y={4} />
        <Separator />
        <Spacer y={4} />

        {/* Artwork price */}
        <PlaceholderText width={100} height={36} />
        <Spacer y={1} />

        {/* commerce button */}
        <PlaceholderBox height={50} />
      </Flex>
    </Flex>
  )
}

export const AboveTheFoldPlaceholder: React.FC<AboveTheFoldPlaceholderProps> = (props) => {
  const enableArtworkRedesign = useFeatureFlag("ARArtworkRedesingPhase2")

  if (enableArtworkRedesign) {
    return <RedesignedAboveTheFoldPlaceholder {...props} />
  }

  return <CurrentAboveTheFoldPlaceholder {...props} />
}
