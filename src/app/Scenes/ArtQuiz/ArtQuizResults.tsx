import { Flex, Screen, Text } from "palette"

export const ArtQuizResults = () => {
  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center">
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">Calculating Results...</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
