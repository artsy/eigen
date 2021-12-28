export type VisualClueName = keyof typeof visualClues

export interface VisualClueDescriptor {
  /**
   * Provide a short description for the admin menu
   */
  readonly description?: string
  /**
   * The order number of the visual clue. If the user has seen a clue all clues
   * with a lower order number have also be seen.
   */
  readonly orderNumber: number
}

// Helper function to get good typings and intellisense
function defineVisualClues<T extends string>(visualClueMap: { readonly [visualClueName in T]: VisualClueDescriptor }) {
  return visualClueMap
}

export const visualClues = defineVisualClues({
  TestClue1: {
    description: "Test Clue 1",
    orderNumber: 4,
  },
})
