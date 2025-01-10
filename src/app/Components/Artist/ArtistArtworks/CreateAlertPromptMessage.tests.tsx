import { screen } from "@testing-library/react-native"
import { __globalStoreTestUtils__ } from "app/store/GlobalStore"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Text } from "react-native"
import { CreateAlertPromptMessage } from "./CreateAlertPromptMessage"

jest.mock("@artsy/palette-mobile", () => ({
  ...jest.requireActual("@artsy/palette-mobile"),
}))

jest.mock("@react-navigation/native", () => ({
  ...jest.requireActual("@react-navigation/native"),
  useNavigation: () => ({
    navigate: jest.fn(),
  }),
}))

describe("CreateAlertPromptMessage", () => {
  const wrapper = () =>
    renderWithWrappers(
      <CreateAlertPromptMessage onPress={() => jest.fn()}>
        <Text>Test Children</Text>
      </CreateAlertPromptMessage>
    )

  it("renders correctly first time", () => {
    __globalStoreTestUtils__?.injectState({
      createAlertPrompt: { promptState: { timesShown: 0, dismissDate: 0 } },
    })
    wrapper()

    expect(screen.getByText("Searching for a particular artwork?")).toBeOnTheScreen()
  })

  it("is not rendered on the third time", () => {
    __globalStoreTestUtils__?.injectState({
      createAlertPrompt: { promptState: { timesShown: 2, dismissDate: 0 } },
    })
    wrapper()

    expect(screen.queryByText("Searching for a particular artwork?")).not.toBeOnTheScreen()
  })

  it("renders correctly second time after 3 days", () => {
    __globalStoreTestUtils__?.injectState({
      // 604800000 is 7 days
      createAlertPrompt: { promptState: { timesShown: 1, dismissDate: Date.now() - 604800000 } },
    })
    wrapper()

    expect(screen.getByText("Searching for a particular artwork?")).toBeOnTheScreen()
  })

  it("is not rendered second time after less than 3 days", () => {
    __globalStoreTestUtils__?.injectState({
      // 259200 is less than 7 days
      createAlertPrompt: { promptState: { timesShown: 1, dismissDate: Date.now() - 259200 } },
    })
    wrapper()

    expect(screen.queryByText("Searching for a particular artwork?")).not.toBeOnTheScreen()
  })
})
