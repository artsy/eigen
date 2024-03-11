import { Box, LinkText, Spacer, Text } from "@artsy/palette-mobile"

export const EditArtworkListsPrivacyHeader = () => {
  return (
    <Box mx={2} mb={2}>
      <Text variant="sm-display">Edit list privacy</Text>

      <Spacer y={2} />

      <Text variant="xs">
        Share your interest in artworks with their respective galleries. Switching lists to private
        will make them visible only to you and opt them out of offers.{" "}
        <LinkText variant="xs">Learn more</LinkText>
      </Text>
    </Box>
  )
}
