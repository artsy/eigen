import { MoneyFillIcon } from "@artsy/icons/native"
import { fireEvent, screen } from "@testing-library/react-native"
import { ConversationEventRow } from "app/Scenes/Inbox/Components/Conversations/ConversationEventRow"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

describe("ConversationEventRow", () => {
  it("renders the message", () => {
    renderWithWrappers(
      <ConversationEventRow
        Icon={MoneyFillIcon}
        iconFill="mono100"
        message="You received an offer for $450"
        textColor="mono100"
      />
    )

    expect(screen.getByText("You received an offer for $450")).toBeTruthy()
  })

  it("renders an inline action link and calls onPress", () => {
    const onPress = jest.fn()

    renderWithWrappers(
      <ConversationEventRow
        Icon={MoneyFillIcon}
        iconFill="mono100"
        message="You purchased this artwork"
        textColor="mono100"
        action={{ label: "See details", onPress }}
      />
    )

    fireEvent.press(screen.getByText("See details."))
    expect(onPress).toHaveBeenCalled()
  })
})
