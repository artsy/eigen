import { CareerHighlightKind } from "app/Scenes/MyCollection/Screens/Insights/CareerHighlightCard"
import { action, Action } from "easy-peasy"

export interface MyCollectionCareerHighlightsModel {
  careerHighlights: { [name: string]: { count: number } }
  setCareerHiglightAsSeen: Action<this, { type: CareerHighlightKind; count: number }>
}

export const getMyCollectionCareerHighlightsModel = (): MyCollectionCareerHighlightsModel => ({
  careerHighlights: {},
  setCareerHiglightAsSeen: action((state, { type, count }) => {
    state.careerHighlights[type] = { count }
  }),
})
