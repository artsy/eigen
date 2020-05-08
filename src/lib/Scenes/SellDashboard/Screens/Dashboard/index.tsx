import React from "react"
import { BorderBox, Box, Button, Flex, Sans } from "@artsy/palette"

interface DashboardProps {
  routeTo: (route: string) => void
}

export const Dashboard: React.FC<DashboardProps> = props => {
  const handleAddPress = () => {
    const route = "/collections/my-collection/artworks/new"
    props.routeTo(route)
  }

  const handleSubmitPress = () => {
    const route = "/collections/my-collection/artworks/new/submissions/new"
    props.routeTo(route)
  }

  const handleEditPress = () => {
    const id = "abc123"
    const route = `/collections/my-collection/artworks/${id}/edit`
    props.routeTo(route)
  }

  const handleConsignPress = () => {
    const id = "def456"
    const route = `/collections/my-collection/artworks/${id}/submissions/new`
    props.routeTo(route)
  }

  return (
    <Box p="2">
      <Sans size="10" mb="3">
        Evaluate & Sell
      </Sans>
      <Button block onPress={handleAddPress} mb="2">
        Add a work
      </Button>
      <Button block onPress={handleSubmitPress} mb="2">
        Submit a work
      </Button>
      <Sans size="6" mb="2" mt="3">
        Works I Own
      </Sans>
      <BorderBox mb="2">
        <Flex flexDirection="row" justifyContent="space-between">
          <Box>
            <Sans size="4">Title of work</Sans>
            <Sans size="2">This work needs more details!</Sans>
          </Box>
          <Button onPress={handleEditPress}>Edit work</Button>
        </Flex>
      </BorderBox>
      <BorderBox mb="2">
        <Flex flexDirection="row" justifyContent="space-between">
          <Box>
            <Sans size="4">Title of another work</Sans>
            <Sans size="2">This work is ready to consign!</Sans>
          </Box>
          <Button onPress={handleConsignPress}>Consign work</Button>
        </Flex>
      </BorderBox>
    </Box>
  )
}
