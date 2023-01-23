import { navigate } from "app/system/navigation/navigate"
import { Flex, LinkText, Text } from "palette"

interface UnlistedArtworksBannerProps {
  partnerName?: string | null
}

export const UnlistedArtworksBanner: React.FC<UnlistedArtworksBannerProps> = ({ partnerName }) => {
  return (
    <Flex backgroundColor="blue100" p={1}>
      <Text
        testID="unlisted-artworks-banner"
        color="white"
        style={{ textAlign: "center" }}
        variant="xs"
      >
        This is a{" "}
        <LinkText
          color="white"
          onPress={() => navigate("/unlisted-artworks-faq")}
          style={{ textDecorationLine: "underline" }}
          variant="xs"
        >
          private listing
        </LinkText>
        {!!partnerName && <> from {partnerName}</>}.
      </Text>
    </Flex>
  )
}
