import { navigate } from "lib/navigation/navigate"
import { Button, Flex, Text } from "palette"
import React from "react"

export const NoMessages: React.FC = () => {
  const handleViewWorks = () => {
    navigate(`/`)
  }
  return (
    <Flex mt={3} mx={2}>
      <Text variant="title" textAlign="center" fontWeight="normal">
        Keep track of your conversations with galleries.
      </Text>
      <Text mb={2} mt={1} mx={4} variant="text" textAlign="center" fontWeight="normal" color="black60">
        Contact galleries to learn more about works you want to collect. Use your inbox to stay on top of your
        inquiries.
      </Text>
      <Flex width="100%" justifyContent="center" flexDirection="row">
        <Button variant="primaryBlack" onPress={handleViewWorks}>
          Explore works
        </Button>
      </Flex>
    </Flex>
  )
}
