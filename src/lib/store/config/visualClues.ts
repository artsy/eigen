export type VisualClueName = keyof typeof visualClues

export interface VisualClueDescriptor {
  /**
   * Provide a short description for the admin menu
   */
  readonly description?: string
}

// Helper function to get good typings and intellisense
function defineVisualClues<T extends string>(visualClueMap: { readonly [visualClueName in T]: VisualClueDescriptor }) {
  return visualClueMap
}

export const visualClues = defineVisualClues({
  // ExampleClueName: {
  //   description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit",
  // },
  TestClue1: {
    description: "Test Clue 1",
  },
  TestClue2: {
    description: "Test Clue 1",
  },
})
