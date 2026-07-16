import AsyncStorage from "@react-native-async-storage/async-storage"
import {
  addGameScore,
  clearGameScores,
  GAME_SCORES_KEY,
  GameScoreRecord,
  getGameScores,
  MAX_STORED_SCORES,
} from "app/Scenes/ArtworkArtistGame/utils/gameScoreHistory"

const record = (percentage: number): GameScoreRecord => ({
  correctCount: percentage / 10,
  total: 10,
  percentage,
  date: new Date().toISOString(),
})

describe("gameScoreHistory", () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })

  it("returns an empty array when nothing is stored", async () => {
    expect(await getGameScores()).toEqual([])
  })

  it("stores a score and reads it back", async () => {
    await addGameScore(record(80))

    const scores = await getGameScores()
    expect(scores).toHaveLength(1)
    expect(scores[0].percentage).toBe(80)
  })

  it("prepends newer scores", async () => {
    await addGameScore(record(50))
    await addGameScore(record(90))

    const scores = await getGameScores()
    expect(scores.map((s) => s.percentage)).toEqual([90, 50])
  })

  it("caps stored scores at MAX_STORED_SCORES", async () => {
    for (let i = 0; i <= MAX_STORED_SCORES; i++) {
      await addGameScore(record((i % 10) * 10))
    }

    const scores = await getGameScores()
    expect(scores).toHaveLength(MAX_STORED_SCORES)
  })

  it("clears scores", async () => {
    await addGameScore(record(70))
    await clearGameScores()

    expect(await getGameScores()).toEqual([])
  })

  it("returns an empty array when stored value is corrupt", async () => {
    await AsyncStorage.setItem(GAME_SCORES_KEY, "not json")

    expect(await getGameScores()).toEqual([])
  })
})
