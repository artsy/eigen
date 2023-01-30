import { Flex, Screen, Spinner, Text } from "palette"
import { useEffect, useState } from "react"

export const ArtQuizResultsLoader = ({ onReady }: { onReady?: () => void }) => {
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const timeouts: ReturnType<typeof setTimeout>[] = []

    timeouts.push(
      setTimeout(() => {
        setLoading(false)
        timeouts.push(setTimeout(onReady!, 1000))
      }, 2000)
    )

    return () => {
      timeouts.forEach(clearTimeout)
    }
  }, [onReady])

  return (
    <Screen>
      <Screen.Body>
        <Flex flex={1} justifyContent="center" alignItems="center" textAlign="center">
          <Flex p={2} justifyContent="center" alignItems="center">
            <Spinner color="blue100" />
          </Flex>
          <Text variant="lg-display">Art Taste Quiz</Text>
          <Text color="black60">{loading ? "Calculating Results..." : "Results Completed"}</Text>
        </Flex>
      </Screen.Body>
    </Screen>
  )
}
