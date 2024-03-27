import { EyeClosedIcon, Flex, Text } from "@artsy/palette-mobile"
import { useFeatureFlag } from "app/utils/hooks/useFeatureFlag"

interface ArtworkListTitleProps {
  title: string
  shareableWithPartners: boolean
}

export const ArtworkListTitle: React.FC<ArtworkListTitleProps> = ({
  title,
  shareableWithPartners,
}) => {
  const isArtworkListOfferabilityEnabled = useFeatureFlag("AREnableArtworkListOfferability")

  return (
    <Flex mx={2} mb={1} flexDirection="row" alignItems="center">
      <Text variant="lg">{title}</Text>

      {!shareableWithPartners && !!isArtworkListOfferabilityEnabled && (
        <EyeClosedIcon ml={0.5} mt={0.5} fill="black100" />
      )}
    </Flex>
  )
}
