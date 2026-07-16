import { Button, Flex, Screen, Separator, Spacer, Text } from "@artsy/palette-mobile"
import {
  ArtworkArtistGamePlayQueryRenderer,
  GameResult,
} from "app/Scenes/ArtworkArtistGame/Components/ArtworkArtistGamePlay"
import { ROUNDS_PER_GAME } from "app/Scenes/ArtworkArtistGame/utils/buildRounds"
import {
  addGameScore,
  clearGameScores,
  GameScoreRecord,
  getGameScores,
} from "app/Scenes/ArtworkArtistGame/utils/gameScoreHistory"
import { goBack } from "app/system/navigation/navigate"
import { MotiView } from "moti"
import { useCallback, useEffect, useState } from "react"

type Phase = "start" | "playing" | "results"

export const ArtworkArtistGame: React.FC = () => {
  const [phase, setPhase] = useState<Phase>("start")
  // gameId changes each game so the play QueryRenderer remounts and refetches.
  const [gameId, setGameId] = useState(0)
  const [lastResult, setLastResult] = useState<GameResult | null>(null)
  const [scores, setScores] = useState<GameScoreRecord[]>([])
  const [progress, setProgress] = useState<{ current: number; total: number } | null>(null)

  const refreshScores = async () => {
    setScores(await getGameScores())
  }

  useEffect(() => {
    refreshScores()
  }, [])

  const startGame = () => {
    setGameId((id) => id + 1)
    setLastResult(null)
    setProgress(null)
    setPhase("playing")
  }

  const handleFinish = async (result: GameResult) => {
    const percentage = Math.round((result.correctCount / result.total) * 100)
    const record: GameScoreRecord = {
      correctCount: result.correctCount,
      total: result.total,
      percentage,
      date: new Date().toISOString(),
    }

    setLastResult(result)
    setPhase("results")
    const updated = await addGameScore(record)
    setScores(updated)
  }

  const handleProgress = useCallback((current: number, total: number) => {
    setProgress({ current, total })
  }, [])

  const handleClearHistory = async () => {
    await clearGameScores()
    await refreshScores()
  }

  if (phase === "playing") {
    return (
      <Screen>
        <Screen.Header
          title="Who made this artwork?"
          onBack={() => setPhase("start")}
          rightElements={
            progress ? (
              <Text variant="sm" color="mono60">
                {progress.current} / {progress.total}
              </Text>
            ) : undefined
          }
        />
        <Screen.Body fullwidth>
          <ArtworkArtistGamePlayQueryRenderer
            key={gameId}
            onFinish={handleFinish}
            onProgress={handleProgress}
          />
        </Screen.Body>
      </Screen>
    )
  }

  if (phase === "results" && lastResult) {
    return (
      <Screen>
        <Screen.AnimatedHeader title="Results" onBack={() => setPhase("start")} />
        <Screen.Body>
          <GameResults
            correctCount={lastResult.correctCount}
            total={lastResult.total}
            onPlayAgain={startGame}
            onBackToStart={() => setPhase("start")}
          />
        </Screen.Body>
      </Screen>
    )
  }

  return (
    <Screen>
      <Screen.Header onBack={goBack} />
      <Screen.Body>
        <Flex flex={1} py={2}>
          <Text variant="lg-display" textAlign="center">
            Guess the Artist
          </Text>
          <Spacer y={1} />
          <Text variant="sm" color="mono60" textAlign="center">
            You'll see {ROUNDS_PER_GAME} artworks. Pick the artist who made each one.
          </Text>

          <Spacer y={4} />

          <Flex flexDirection="row" justifyContent="space-between" alignItems="center">
            <Text variant="md">Previous scores</Text>
            {scores.length > 0 && (
              <Text variant="xs" color="blue100" onPress={handleClearHistory}>
                Clear
              </Text>
            )}
          </Flex>
          <Spacer y={1} />

          <Flex flex={1}>
            {scores.length === 0 ? (
              <Text variant="sm" color="mono60">
                No games played yet.
              </Text>
            ) : (
              <Screen.ScrollView>
                {scores.map((score, index) => (
                  <Flex key={`${score.date}-${index}`}>
                    <Flex flexDirection="row" justifyContent="space-between" py={1}>
                      <Text variant="sm">{formatDate(score.date)}</Text>
                      <Text variant="sm" weight="medium">
                        {score.percentage}% ({score.correctCount}/{score.total})
                      </Text>
                    </Flex>
                    <Separator />
                  </Flex>
                ))}
              </Screen.ScrollView>
            )}
          </Flex>

          <Spacer y={2} />
          <Button block onPress={startGame}>
            Play
          </Button>
          <Spacer y={2} />
        </Flex>
      </Screen.Body>
    </Screen>
  )
}

const formatDate = (iso: string): string => {
  const date = new Date(iso)
  if (isNaN(date.getTime())) return iso
  return date.toLocaleDateString(undefined, { month: "short", day: "numeric", year: "numeric" })
}

const COUNT_UP_DURATION = 600

// Counts from 0 up to `target` over `duration` ms using requestAnimationFrame.
const useCountUp = (target: number, duration: number = COUNT_UP_DURATION): number => {
  const [value, setValue] = useState(0)

  useEffect(() => {
    let frame: number
    let startTime: number | null = null

    const step = (timestamp: number) => {
      if (startTime === null) {
        startTime = timestamp
      }

      const progress = Math.min((timestamp - startTime) / duration, 1)
      setValue(Math.round(progress * target))

      if (progress < 1) {
        frame = requestAnimationFrame(step)
      }
    }

    frame = requestAnimationFrame(step)

    return () => cancelAnimationFrame(frame)
  }, [target, duration])

  return value
}

interface GameResultsProps {
  correctCount: number
  total: number
  onPlayAgain: () => void
  onBackToStart: () => void
}

const GameResults: React.FC<GameResultsProps> = ({
  correctCount,
  total,
  onPlayAgain,
  onBackToStart,
}) => {
  const percentage = Math.round((correctCount / total) * 100)
  const displayPercentage = useCountUp(percentage)

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: "timing", duration: 400 }}
      style={{ flex: 1 }}
    >
      <Flex flex={1} justifyContent="center" alignItems="center">
        <Text variant="xxl">{displayPercentage}%</Text>
        <Spacer y={1} />
        <Text variant="md" color="mono60">
          You got {correctCount} out of {total} right
        </Text>
        <Spacer y={4} />
        <Button block onPress={onPlayAgain}>
          Play again
        </Button>
        <Spacer y={1} />
        <Button block variant="outline" onPress={onBackToStart}>
          Back to start
        </Button>
      </Flex>
    </MotiView>
  )
}
