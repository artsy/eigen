import { navigate } from "lib/navigation/navigate"
import { Box, Button, Flex, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"

export const EmptyMessage: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Flex px={2} py={4} justifyContent="center" alignItems="center" height="100%">
        <Box maxWidth="80%" alignItems="center">
          <Text variant="md" textAlign="center">
            You haven’t created any Alerts yet.
          </Text>
          <Spacer mb={1} />
          <Text textAlign="center" variant="xs" color="black60">
            Filter for the artworks you love on an Artist Page and tap ‘Create Alert’ to be notified
            when new works are added to Artsy.
          </Text>
          <Spacer mb={2} />
          <Button onPress={() => navigate("/")}>Explore Artists</Button>
        </Box>
      </Flex>
    </ScrollView>
  )
}
