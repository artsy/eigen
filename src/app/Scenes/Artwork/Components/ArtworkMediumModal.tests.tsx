import { fireEvent } from "@testing-library/react-native"
import { setupTestWrapperTL } from "app/tests/setupTestWrapper"
import { Theme } from "palette"
import { SafeAreaProvider } from "react-native-safe-area-context"
import { graphql } from "react-relay"
import { ArtworkMediumModalFragmentContainer } from "./ArtworkMediumModal"

jest.unmock("react-relay")

describe("CertificateAuthenticityModal", () => {
  const onClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  const { renderWithRelay } = setupTestWrapperTL({
    Component: (props: any) => (
      <SafeAreaProvider>
        <Theme>
          <ArtworkMediumModalFragmentContainer artwork={props.artwork} visible onClose={onClose} />
        </Theme>
      </SafeAreaProvider>
    ),
    query: graphql`
      query ArtworkMediumModal_Test_Query {
        artwork(id: "test-artwork") {
          ...ArtworkMediumModal_artwork
        }
      }
    `,
  })

  it("renders", () => {
    const { getByText, getAllByText } = renderWithRelay()

    expect(getByText('<mock-value-for-field-"name">')).toBeDefined()
    expect(getByText('<mock-value-for-field-"longDescription">')).toBeDefined()
    expect(getAllByText("OK")[0]).toBeDefined()
  })

  it("calls onClose when clicking the button", () => {
    const { getAllByText } = renderWithRelay()

    fireEvent.press(getAllByText("OK")[0])
    expect(onClose).toHaveBeenCalledTimes(1)
  })
})
