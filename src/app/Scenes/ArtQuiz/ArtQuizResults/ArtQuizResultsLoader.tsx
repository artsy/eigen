import { Flex, Screen, Spinner, Text } from "palette"

export const ArtQuizResultsLoader = ({ isReady }: { isReady?: boolean }) => {
  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">{isReady ? "Results Completed" : "Calculating Results..."}</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
