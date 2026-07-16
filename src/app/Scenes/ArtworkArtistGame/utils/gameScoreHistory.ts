import AsyncStorage from "@react-native-async-storage/async-storage"

export const GAME_SCORES_KEY = "ARTWORK_ARTIST_GAME_SCORES"
export const MAX_STORED_SCORES = 20

export interface GameScoreRecord {
  correctCount: number
  total: number
  percentage: number
  /** ISO date string of when the game was completed */
  date: string
}

export const getGameScores = async (): Promise<GameScoreRecord[]> => {
  try {
    const json = await AsyncStorage.getItem(GAME_SCORES_KEY)

    if (!json) return []

    const scores = JSON.parse(json)

    return Array.isArray(scores) ? scores : []
  } catch (error) {
    console.error("Failed to read game scores", error)
    return []
  }
}

export const addGameScore = async (record: GameScoreRecord): Promise<GameScoreRecord[]> => {
  const scores = await getGameScores()
  const updated = [record, ...scores].slice(0, MAX_STORED_SCORES)

  await AsyncStorage.setItem(GAME_SCORES_KEY, JSON.stringify(updated))

  return updated
}

export const clearGameScores = async (): Promise<void> => {
  await AsyncStorage.removeItem(GAME_SCORES_KEY)
}
