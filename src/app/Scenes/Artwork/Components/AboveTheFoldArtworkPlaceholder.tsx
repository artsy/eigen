import { useFeatureFlag } from "app/store/GlobalStore"
import { PlaceholderBox, PlaceholderText, RandomWidthPlaceholderText } from "app/utils/placeholders"
import { times } from "lodash"
import { Flex, Join, Separator, Spacer, useSpace } from "palette"
import { useImagePlaceholderDimensions } from "../helpers"

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

const ArtworkDetailsPlaceholder = () => {
  return (
    <Join separator={<Spacer mt={1} />}>
      {times(10).map((index) => (
        <Flex key={`detail-row-${index}`} flexDirection="row">
          <PlaceholderText width={128} height={20} />
          <Spacer mr={2} />
          <RandomWidthPlaceholderText minWidth={100} maxWidth={250} height={20} />
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
        <Flex flex={1} flexDirection="row" justifyContent="space-between">
          <PlaceholderBox width={20} height={20} />

          <Flex flexDirection="row">
            <PlaceholderBox width={80} height={20} marginRight={space(1)} />
            <PlaceholderBox width={140} height={20} />
          </Flex>
        </Flex>
      </Flex>

      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
      </Flex>

      <Spacer mt={1} />

      {/* Content */}
      <Flex px={2}>
        {/* save/share buttons */}
        <ArtworkActionsPlaceholder />

        <Spacer mb={4} />

        {/* Artist name */}
        <PlaceholderText width={100} height={30} />

        {/* Artwork tombstone details */}
        <PlaceholderText width={250} height={26} />

        <Spacer mb={4} />

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
    <Flex pt={5} pb={2}>
      {/* Artwork thumbnail */}
      <Flex mx="auto">
        <PlaceholderBox width={width} height={height} />
      </Flex>
      <Spacer mb={2} />

      {/* Content */}
      <Flex px={2} flex={1}>
        {/* save/share buttons */}
        <Flex flexDirection="row" justifyContent="center" alignItems="center" height={30}>
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
          <PlaceholderBox width={50} height={15} marginHorizontal={space(1)} />
        </Flex>
        <Spacer mb={4} />

        {/* Artist name */}
        <PlaceholderText width={100} height={26} />

        {/* Artwork tombstone details */}
        <PlaceholderText width={250} height={26} marginBottom={0} />

        {/* more junk */}
        <Spacer mb={3} />
        <Separator />
        <Spacer mb={3} />

        {/* Artwork price */}
        <PlaceholderText width={100} height={36} />
        <Spacer mb={1} />

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
