import { goBack } from "app/navigation/navigate"
import { Box, Button, Join, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"
import { useScreenDimensions } from "shared/hooks/useScreenDimensions"

export const PrivateListingsFAQScreen: React.FC = () => {
  const { safeAreaInsets } = useScreenDimensions()

  return (
    <ScrollView>
      <Box pt={safeAreaInsets.top} pb={safeAreaInsets.bottom} px={2}>
        <Box my={3}>
          <Join separator={<Spacer my={1.5} />}>
            <Text variant="lg-display">Private Listings</Text>

            <Join separator={<Spacer my={1} />}>
              <Text>
                Private listings are shared by galleries with select collectors. You need a link to
                find them—they won’t appear in searches on Artsy. Use the heart icon to add a
                private listing to your Saves, for easy access.
              </Text>
            </Join>

            <Button onPress={() => goBack()} block>
              OK
            </Button>
          </Join>
        </Box>
      </Box>
    </ScrollView>
  )
}
