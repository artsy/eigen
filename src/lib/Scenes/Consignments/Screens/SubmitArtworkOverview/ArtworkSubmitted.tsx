import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Sans, Spacer } from "palette"
import { ArtsyLogoHeader } from "palette/elements/Header/ArtsyLogoHeader"
import React from "react"
import { View } from "react-native"

export const ArtworkSubmitted: React.FC = () => {
  return (
    <View>
      <ArtsyLogoHeader shadow />
      <Sans size="6" mx="2">
        Your Artwork has been submitted
      </Sans>
      <Spacer mb={2} />
      <Sans size="1" mx="2" color="black60">
        We will email you within 1-3 days to confirm if your artwork has been accepted or not. In the meantime your
        submission will appear in the feature, My Collection.
      </Sans>
      <Spacer mb={2} />
      <Sans size="1" mx="2" color="black60">
        With low fees, informed pricing, and multiple sales options, why not submit another piece with Artsy.
      </Sans>
      <Spacer mb={4} />
      <Flex justifyContent="space-between" mx={2}>
        <Button
          block
          haptic
          maxWidth={540}
          onPress={() => {
            navigate(`/submit-artwork`)
          }}
        >
          Submit another Artwork
        </Button>
        <Spacer mb={2} />
        <Button
          block
          haptic
          maxWidth={540}
          variant="outline"
          onPress={() => {
            navigate(`/my-profile`)
          }}
        >
          View Artwork in My Collection
        </Button>
      </Flex>
    </View>
  )
}
