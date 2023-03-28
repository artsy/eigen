import { Flex, Spinner, Screen, Text } from "@artsy/palette-mobile"

export const ArtQuizLoader = ({ isCalculatingResult }: { isCalculatingResult?: boolean }) => {
  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          {isCalculatingResult && (
            <>
              <Text variant="lg-display">Art Taste Quiz</Text>
              <Text color="black60">Calculating Results...</Text>
            </>
          )}
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
