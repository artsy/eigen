import { Flex, Text, Touchable, useColor, useScreenDimensions } from "@artsy/palette-mobile"
import FastImage from "@d11/react-native-fast-image"
import { ArtworkArtistGamePlayQuery } from "__generated__/ArtworkArtistGamePlayQuery.graphql"
import { LoadFailureView } from "app/Components/LoadFailureView"
import { ArtworkArtistGamePlayPlaceholder } from "app/Scenes/ArtworkArtistGame/Components/ArtworkArtistGamePlayPlaceholder"
import { GameArtworkImage } from "app/Scenes/ArtworkArtistGame/Components/GameArtworkImage"
import {
  buildRounds,
  GameArtist,
  GameArtwork,
  GameRound,
  ROUNDS_PER_GAME,
} from "app/Scenes/ArtworkArtistGame/utils/buildRounds"
import { extractNodes } from "app/utils/extractNodes"
import { seededShuffle, useStableShuffle } from "app/utils/hooks/useStableShuffle"
import { withSuspense } from "app/utils/hooks/withSuspense"
import { sizeToFit } from "app/utils/useSizeToFit"
import { MotiView } from "moti"
import { useEffect, useRef, useState } from "react"
import { graphql, useLazyLoadQuery } from "react-relay"

const REVEAL_ANIMATION_DURATION = 200
const ROUND_TRANSITION_DURATION = 250

export const REVEAL_DELAY = 1200

export interface GameResult {
  correctCount: number
  total: number
}

interface ArtworkArtistGamePlayProps {
  onFinish: (result: GameResult) => void
  onProgress?: (current: number, total: number) => void
}

interface GamePlayProps {
  rounds: GameRound[]
  onFinish: (result: GameResult) => void
  onProgress?: (current: number, total: number) => void
}

interface GameChoiceProps {
  artist: GameArtist
  answered: boolean
  isCorrect: boolean
  isSelected: boolean
  onPress: () => void
}

// A single answer button. Once an answer is locked in, it animates its background
// and border to the reveal colors, with a small scale "pop" on the correct choice.
const GameChoice: React.FC<GameChoiceProps> = ({
  artist,
  answered,
  isCorrect,
  isSelected,
  onPress,
}) => {
  const color = useColor()

  const revealColor =
    answered && isCorrect ? color("green100") : answered && isSelected ? color("red100") : null

  const backgroundColor = revealColor ?? color("background")
  const borderColor = revealColor ?? color("mono30")
  const isHighlighted = answered && (isCorrect || isSelected)

  return (
    <Touchable accessibilityRole="button" disabled={answered} onPress={onPress}>
      <MotiView
        animate={{
          backgroundColor,
          borderColor,
          // Array is a keyframe sequence — pop out then settle back.
          scale: answered && isCorrect ? [1.04, 1] : 1,
        }}
        transition={{ type: "timing", duration: REVEAL_ANIMATION_DURATION }}
        style={{ borderWidth: 1, borderRadius: 5 }}
      >
        <Flex py={1} px={2}>
          <Text variant="sm" textAlign="center" color={isHighlighted ? "mono0" : "mono100"}>
            {artist.name}
          </Text>
        </Flex>
      </MotiView>
    </Touchable>
  )
}

// Presentational play component — receives prepared rounds and runs the game loop.
export const GamePlay: React.FC<GamePlayProps> = ({ rounds, onFinish, onProgress }) => {
  const { width, height, safeAreaInsets } = useScreenDimensions()
  const [currentIndex, setCurrentIndex] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [selectedArtistID, setSelectedArtistID] = useState<string | null>(null)
  const timeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    return () => {
      if (timeout.current) clearTimeout(timeout.current)
    }
  }, [])

  useEffect(() => {
    onProgress?.(currentIndex + 1, rounds.length)
  }, [currentIndex, rounds.length, onProgress])

  // Warm the image cache for every round up front so later artworks appear instantly.
  // Low priority so the currently-displayed artwork still loads first.
  useEffect(() => {
    const sources = rounds
      .map((r) => r.artwork.imageURL)
      .filter(Boolean)
      .map((uri) => ({ uri, priority: FastImage?.priority?.low }))

    try {
      FastImage?.preload?.(sources)
    } catch (error) {
      // Prefetching is best-effort — never let it break the game (e.g. no native module in tests).
      console.warn("Failed to prefetch game images", error)
    }
  }, [rounds])

  const round = rounds[currentIndex]
  const { shuffled: choices } = useStableShuffle({
    items: round.choices,
    seed: round.artwork.internalID,
  })

  const handlePick = (artistID: string) => {
    if (selectedArtistID !== null) return

    const isCorrect = artistID === round.correctArtistID
    const newCorrectCount = correctCount + (isCorrect ? 1 : 0)

    setSelectedArtistID(artistID)
    setCorrectCount(newCorrectCount)

    timeout.current = setTimeout(() => {
      if (currentIndex + 1 >= rounds.length) {
        onFinish({ correctCount: newCorrectCount, total: rounds.length })
        return
      }

      setCurrentIndex(currentIndex + 1)
      setSelectedArtistID(null)
    }, REVEAL_DELAY)
  }

  const answered = selectedArtistID !== null

  // Fit the artwork inside a bounding box (preserving aspect ratio) so it is never
  // cropped, while leaving room for the choices above the safe area.
  const container = { width: width - 32, height: height * 0.4 }
  const displaySize = sizeToFit(
    {
      width: round.artwork.imageWidth || container.width,
      height: round.artwork.imageHeight || container.height,
    },
    container
  )

  return (
    <Flex flex={1} px={2} style={{ paddingBottom: safeAreaInsets.bottom + 8 }}>
      {/* Keyed on the round so each new artwork + choices fades in as the previous fades away. */}
      <MotiView
        key={currentIndex}
        from={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "timing", duration: ROUND_TRANSITION_DURATION }}
        style={{ flex: 1 }}
      >
        <Flex flex={1} justifyContent="center">
          <GameArtworkImage
            imageURL={round.artwork.imageURL}
            width={displaySize.width}
            height={displaySize.height}
            blurhash={round.artwork.blurhash}
            href={round.artwork.href}
            artworkRef={round.artwork.saveArtworkRef}
          />
        </Flex>

        <Flex gap={0.5}>
          {choices.map((artist) => (
            <GameChoice
              key={artist.internalID}
              artist={artist}
              answered={answered}
              isCorrect={artist.internalID === round.correctArtistID}
              isSelected={artist.internalID === selectedArtistID}
              onPress={() => handlePick(artist.internalID)}
            />
          ))}
        </Flex>
      </MotiView>
    </Flex>
  )
}

const artworkArtistGamePlayQuery = graphql`
  query ArtworkArtistGamePlayQuery @relay_test_operation {
    discoverArtworks(limit: 15) {
      edges {
        node {
          internalID
          title
          href
          image {
            url(version: "large")
            width
            height
            blurhash
          }
          artists(shallow: true) {
            internalID
            name
          }
          ...useSaveArtworkToArtworkLists_artwork
        }
      }
    }
    highlights {
      popularArtists(size: 40) {
        internalID
        name
      }
    }
  }
`

export const ArtworkArtistGamePlayQueryRenderer = withSuspense<ArtworkArtistGamePlayProps>({
  Component: ({ onFinish, onProgress }) => {
    const data = useLazyLoadQuery<ArtworkArtistGamePlayQuery>(
      artworkArtistGamePlayQuery,
      {},
      { fetchPolicy: "network-only" }
    )

    const artworks = extractNodes(data.discoverArtworks).reduce<GameArtwork[]>((acc, node) => {
      const artist = node.artists?.[0]
      const imageURL = node.image?.url

      if (artist?.internalID && artist.name && imageURL) {
        acc.push({
          internalID: node.internalID,
          title: node.title,
          href: node.href ?? null,
          imageURL,
          imageWidth: node.image?.width,
          imageHeight: node.image?.height,
          blurhash: node.image?.blurhash,
          artist: { internalID: artist.internalID, name: artist.name },
          saveArtworkRef: node,
        })
      }

      return acc
    }, [])

    const artistPool = (data.highlights?.popularArtists ?? []).reduce<GameArtist[]>(
      (acc, artist) => {
        if (artist?.internalID && artist.name) {
          acc.push({ internalID: artist.internalID, name: artist.name })
        }
        return acc
      },
      []
    )

    const rounds = buildRounds(artworks, artistPool, (items, seed) =>
      seededShuffle(seed).shuffle(items)
    )

    if (rounds.length < ROUNDS_PER_GAME) {
      return (
        <Flex flex={1} justifyContent="center" alignItems="center" px={2}>
          <Text variant="sm" textAlign="center" color="mono60">
            Not enough artworks to start a game right now. Please try again later.
          </Text>
        </Flex>
      )
    }

    return <GamePlay rounds={rounds} onFinish={onFinish} onProgress={onProgress} />
  },
  LoadingFallback: ArtworkArtistGamePlayPlaceholder,
  ErrorFallback: () => (
    <Flex flex={1}>
      <LoadFailureView />
    </Flex>
  ),
})
