import { FileDownload_attachment$data } from "__generated__/FileDownload_attachment.graphql"
import AttachmentPreview from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/AttachmentPreview"
import { FileDownloadFragmentContainer as FileDownload } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/FileDownload"
import { CleanRelayFragment } from "app/utils/relayHelpers"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import { Linking } from "react-native"

Linking.openURL = jest.fn()
it("opens file url when it is selected", async () => {
  const component = renderWithWrappersLEGACY(<FileDownload attachment={attachment as any} />)
  component.root.findByType(AttachmentPreview).props.onSelected()
  expect(Linking.openURL).toBeCalledWith(attachment.downloadURL)
})

const attachment: CleanRelayFragment<FileDownload_attachment$data> = {
  fileName: "This is a great ZIP file telling you all about cats",
  downloadURL: "http://example.com/cats.zip",
}
