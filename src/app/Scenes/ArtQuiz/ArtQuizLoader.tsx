import { Flex, Spinner, LegacyScreen, Text } from "@artsy/palette-mobile"

export const ArtQuizLoader = ({ isCalculatingResult }: { isCalculatingResult?: boolean }) => {
  return (
    <LegacyScreen>
      <LegacyScreen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          {!!isCalculatingResult && (
            <>
              <Text variant="lg-display">Finding art for you...</Text>
              <Text color="mono60">Calculating Results...</Text>
            </>
          )}
        </Flex>
      </LegacyScreen.Body>
    </LegacyScreen>
  )
}
