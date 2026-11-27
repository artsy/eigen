import { fireEvent, screen, waitFor } from "@testing-library/react-native"
import { NewsScreen } from "app/Scenes/Articles/News/News"
import { getMockRelayEnvironment } from "app/system/relay/defaultEnvironment"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { resolveMostRecentRelayOperation } from "app/utils/tests/resolveMostRecentRelayOperation"
import { act } from "react"

describe("NewsScreen", () => {
  it("fetches the news again when retrying after a failed load", async () => {
    await renderWithWrappers(<NewsScreen />)

    await act(async () => {
      getMockRelayEnvironment().mock.rejectMostRecentOperation(new Error("Network request failed"))
    })

    expect(await screen.findByText("Unable to load")).toBeOnTheScreen()
    // The News route has no native header, so the error state needs a way back
    expect(screen.getByLabelText("Go back")).toBeOnTheScreen()

    await fireEvent.press(screen.getByLabelText("Retry"))

    // A new request is made instead of re-throwing the cached error
    await waitFor(() => expect(getMockRelayEnvironment().mock.getAllOperations()).toHaveLength(1))

    await resolveMostRecentRelayOperation(getMockRelayEnvironment())

    await waitFor(() => expect(screen.queryByText("Unable to load")).not.toBeOnTheScreen())
    expect(screen.queryByLabelText("Retry")).not.toBeOnTheScreen()
  })
})
