import { Box, Flex, Image, Text, useColor } from "@artsy/palette-mobile"
import { Fair } from "app/Scenes/CityGuide/utils/types"
import { RouterLink } from "app/system/navigation/RouterLink"
import { Dimensions } from "react-native"

const CARD_WIDTH_OFFSET = 50
const CARD_HEIGHT = 310
const LOGO_SIZE = 100
const LOGO_MARGIN_BOTTOM = 10
const OVERLAY_COLOR = "rgba(0, 0, 0, 0.3)"

interface Props {
  fair: Fair
}

// @TODO: Implement tests for this component https://artsyproduct.atlassian.net/browse/LD-549
export const CityGuideFairEventSectionCard: React.FC<Props> = ({ fair }) => {
  const color = useColor()
  const { image, name, profile, exhibition_period, slug } = fair

  const width = Dimensions.get("window").width / 2 + CARD_WIDTH_OFFSET

  return (
    <RouterLink to={`/fair/${slug}`}>
      <Box
        width={width}
        height={CARD_HEIGHT}
        overflow="hidden"
        backgroundColor="mono60"
        style={{ position: "relative" }}
      >
        {!!image?.url && (
          <Image
            src={image.url}
            height={CARD_HEIGHT}
            width={width}
            style={{ backgroundColor: color("mono60") }}
          />
        )}
        {/* Set background color of overlay based on logo color */}
        <Flex
          zIndex={2}
          style={{
            backgroundColor: OVERLAY_COLOR,
            width: "100%",
            height: "100%",
            position: "absolute",
          }}
        />
        <Flex flexDirection="column" px={2} style={{ position: "absolute" }} zIndex={3}>
          {!!profile?.icon?.url ? (
            <Image
              src={profile?.icon?.url}
              width={LOGO_SIZE}
              height={LOGO_SIZE}
              tintColor="white"
              style={{
                backgroundColor: "transparent",
                marginBottom: LOGO_MARGIN_BOTTOM,
                position: "absolute",
              }}
            />
          ) : null}
        </Flex>
        <Box p={2} style={{ position: "absolute", bottom: 0, left: 0 }} zIndex={4}>
          <Flex flexDirection="column" flexGrow={1}>
            <Text variant="sm" weight="medium" color="mono0">
              {name}
            </Text>
            {!!exhibition_period && (
              <Text variant="sm" color="mono0">
                {exhibition_period}
              </Text>
            )}
          </Flex>
        </Box>
      </Box>
    </RouterLink>
  )
}
