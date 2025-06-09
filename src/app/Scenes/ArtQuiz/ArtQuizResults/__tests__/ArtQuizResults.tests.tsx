import { Tabs, Text } from "@artsy/palette-mobile"
import { fireEvent, screen } from "@testing-library/react-native"
import { ArtQuizResultsTabsTestsQuery } from "__generated__/ArtQuizResultsTabsTestsQuery.graphql"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

jest.mock("@artsy/palette-mobile", () => {
  const palette = jest.requireActual("@artsy/palette-mobile")

  return {
    ...palette,
    Tabs: {
      ...palette.Tabs,
      TabsWithHeader: jest.fn(),
    },
  }
})

describe("ArtQuizResults", () => {
  const TabsWithHeader = Tabs.TabsWithHeader as jest.Mock

  const { renderWithRelay } = setupTestWrapper<ArtQuizResultsTabsTestsQuery>({
    Component: ({ me }) => <ArtQuizResultsTabs me={me} />,
    query: graphql`
      query ArtQuizResultsTabsTestsQuery @relay_test_operation {
        me {
          quiz {
            savedArtworks {
              __typename
            }
          }
          ...ArtQuizResultsTabs_me
        }
      }
    `,
  })

  it.each([
    [
      "worksYouLiked",
      "Explore Your Quiz Results",
      "We think you’ll enjoy these recommendations based on your likes. Keep saving and following to continue tailoring Artsy to you.",
    ],
    [
      "worksForYou",
      "Explore Art We Think You'll Love",
      "We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love.",
    ],
    [
      "artistsForYou",
      "Explore Art We Think You'll Love",
      "We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love.",
    ],
  ])("should display expected header for %s tab", (selected, title, subtitle) => {
    TabsWithHeader.mockImplementation((props) => {
      // Simulate the tab change event by calling the prop immediately
      if (props.onTabChange) {
        props.onTabChange({ tabName: selected })
      }
      return (
        <>
          <Text>{props.title}</Text>
          {props.BelowTitleHeaderComponent()}
          {props.children}
        </>
      )
    })

    renderWithRelay()

    const tab = screen.getByText(selected)
    fireEvent.press(tab)

    expect(screen.getByText(title)).toBeTruthy()
    expect(screen.getByText(subtitle)).toBeTruthy()
  })
})
