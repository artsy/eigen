import { TestProviders } from "app/Providers"
import { HomeViewScreenComponent } from "app/Scenes/HomeView/HomeView"
import { measureRenders } from "reassure"

// Mock the useLazyLoadQuery to return mock data
jest.mock("react-relay", () => ({
  ...jest.requireActual("react-relay"),
  useLazyLoadQuery: jest.fn(() => ({
    viewer: {
      homeView: {
        sectionsConnection: {
          edges: Array.from({ length: 10 }, (_, i) => ({
            node: {
              __typename: "HomeViewSectionArtworks",
              internalID: `section-${i}`,
              component: {
                title: `Section ${i}`,
                type: "Artworks",
              },
            },
          })),
        },
      },
      me: null,
    },
    homeView: {
      experiments: [],
    },
  })),
  usePaginationFragment: jest.fn(() => ({
    data: {
      homeView: {
        sectionsConnection: {
          edges: Array.from({ length: 10 }, (_, i) => ({
            node: {
              __typename: "HomeViewSectionArtworks",
              internalID: `section-${i}`,
              component: {
                title: `Section ${i}`,
                type: "Artworks",
              },
            },
          })),
        },
      },
      me: null,
    },
    loadNext: jest.fn(),
    hasNext: false,
    isLoadingNext: false,
    refetch: jest.fn(),
  })),
}))

describe("HomeView Performance Tests", () => {
  test("HomeView initial mount performance", async () => {
    await measureRenders(<HomeViewScreenComponent />, {
      runs: 10,
      warmupRuns: 1,
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    })
  })

  test("HomeView with minimal sections", async () => {
    const useLazyLoadQuery = require("react-relay").useLazyLoadQuery
    const usePaginationFragment = require("react-relay").usePaginationFragment

    useLazyLoadQuery.mockReturnValue({
      viewer: {},
      homeView: { experiments: [] },
    })

    usePaginationFragment.mockReturnValue({
      data: {
        homeView: {
          sectionsConnection: {
            edges: Array.from({ length: 5 }, (_, i) => ({
              node: {
                __typename: "HomeViewSectionArtworks",
                internalID: `section-${i}`,
                component: {
                  title: `Section ${i}`,
                  type: "Artworks",
                },
              },
            })),
          },
        },
        me: null,
      },
      loadNext: jest.fn(),
      hasNext: false,
      isLoadingNext: false,
      refetch: jest.fn(),
    })

    await measureRenders(<HomeViewScreenComponent />, {
      runs: 10,
      warmupRuns: 1,
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    })
  })

  test("HomeView with many sections", async () => {
    const useLazyLoadQuery = require("react-relay").useLazyLoadQuery
    const usePaginationFragment = require("react-relay").usePaginationFragment

    useLazyLoadQuery.mockReturnValue({
      viewer: {},
      homeView: { experiments: [] },
    })

    usePaginationFragment.mockReturnValue({
      data: {
        homeView: {
          sectionsConnection: {
            edges: Array.from({ length: 20 }, (_, i) => ({
              node: {
                __typename: "HomeViewSectionArtworks",
                internalID: `section-${i}`,
                component: {
                  title: `Section ${i}`,
                  type: "Artworks",
                },
              },
            })),
          },
        },
        me: null,
      },
      loadNext: jest.fn(),
      hasNext: true,
      isLoadingNext: false,
      refetch: jest.fn(),
    })

    await measureRenders(<HomeViewScreenComponent />, {
      runs: 10,
      warmupRuns: 1,
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    })
  })

  test("HomeView re-render after state update", async () => {
    const scenario = async () => {
      // Simulate a state update or interaction
      await new Promise((resolve) => setTimeout(resolve, 100))
    }

    await measureRenders(<HomeViewScreenComponent />, {
      runs: 10,
      warmupRuns: 1,
      scenario,
      wrapper: ({ children }) => <TestProviders>{children}</TestProviders>,
    })
  })
})
