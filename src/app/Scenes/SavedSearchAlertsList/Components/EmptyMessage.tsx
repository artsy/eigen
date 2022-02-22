import { navigate } from "app/navigation/navigate"
import { Box, Button, Flex, quoteLeft, quoteRight, Spacer, Text } from "palette"
import React from "react"
import { ScrollView } from "react-native"

export const EmptyMessage: React.FC = () => {
  return (
    <ScrollView contentContainerStyle={{ flex: 1 }}>
      <Flex px={2} py={4} justifyContent="center" alignItems="center" height="100%">
        <Box maxWidth="80%" alignItems="center">
          <Text variant="md" textAlign="center">
            Create an alert to get notified about new works.
          </Text>
          <Spacer mb={1} />
          <Text textAlign="center" variant="xs" color="black60">
            {`Search for an artist, use the filters to define the artwork you want, and select ${quoteLeft}Create Alert.${quoteRight}`}
          </Text>
          <Spacer mb={2} />
          <Button onPress={() => navigate("/")}>Explore Artists</Button>
        </Box>
      </Flex>
    </ScrollView>
  )
}
