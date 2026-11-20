import { fireEvent, screen } from "@testing-library/react-native"
import { FileDownload_attachment$data } from "__generated__/FileDownload_attachment.graphql"
import { FileDownloadFragmentContainer as FileDownload } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/FileDownload"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"
import { Linking } from "react-native"

Linking.openURL = jest.fn()
it("opens file url when it is selected", async () => {
  renderWithWrappers(<FileDownload attachment={attachment as any} />)
  fireEvent.press(screen.getByRole("button"))
  expect(Linking.openURL).toBeCalledWith(attachment.downloadURL)
})

const attachment: CleanRelayFragment<FileDownload_attachment$data> = {
  fileName: "This is a great ZIP file telling you all about cats",
  downloadURL: "http://example.com/cats.zip",
}
