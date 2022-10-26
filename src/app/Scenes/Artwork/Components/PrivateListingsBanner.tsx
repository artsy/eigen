import { navigate } from "app/navigation/navigate"
import { Flex, LinkText, Text } from "palette"

interface PrivateListingsBannerProps {
  partnerName?: string | null
}

export const PrivateListingsBanner: React.FC<PrivateListingsBannerProps> = ({ partnerName }) => {
  return (
    <>
      <Flex backgroundColor="blue100" p={1}>
        <Text
          testID="private-listings-banner"
          color="white"
          style={{ textAlign: "center" }}
          variant="xs"
        >
          This is a{" "}
          <LinkText
            color="white"
            onPress={() => navigate("/private-listings-faq")}
            style={{ textDecorationLine: "underline" }}
            variant="xs"
          >
            private listing
          </LinkText>
          {!!partnerName && <> from {partnerName}</>}.
        </Text>
      </Flex>
    </>
  )
}
