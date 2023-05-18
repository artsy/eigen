import { fireEvent, screen } from "@testing-library/react-native"
import { ArtQuizResultsTabsTestsQuery } from "__generated__/ArtQuizResultsTabsTestsQuery.graphql"
import { ArtQuizResultsTabs } from "app/Scenes/ArtQuiz/ArtQuizResults/ArtQuizResultsTabs/ArtQuizResultsTabs"
import { setupTestWrapper } from "app/utils/tests/setupTestWrapper"
import { graphql } from "react-relay"

describe("ArtQuizResults", () => {
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
      "Works you liked",
      "Explore Art We Think You'll Love",
      "We think you’ll enjoy these recommendations based on your likes. Keep saving and following to continue tailoring Artsy to you.",
    ],
    [
      "Works for You",
      "Explore Your Quiz Results",
      "We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love.",
    ],
    [
      "Artists for You",
      "Explore Your Quiz Results",
      "We think you’ll enjoy these recommendations based on your likes. To tailor Artsy to your art tastes, follow artists and save works you love.",
    ],
  ])("should display expected header for %s tab", (selected, title, subtitle) => {
    renderWithRelay()

    const tab = screen.getByText(selected)
    fireEvent.press(tab)

    expect(screen.getByText(title)).toBeTruthy()
    expect(screen.getByText(subtitle)).toBeTruthy()
  })
})
