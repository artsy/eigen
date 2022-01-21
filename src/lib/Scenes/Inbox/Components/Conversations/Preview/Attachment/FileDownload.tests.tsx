import { FileDownload_attachment } from "__generated__/FileDownload_attachment.graphql"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import React from "react"
import { Linking } from "react-native"

import AttachmentPreview from "./AttachmentPreview"
import { FileDownloadFragmentContainer as FileDownload } from "./FileDownload"

Linking.openURL = jest.fn()
it("opens file url when it is selected", async () => {
  const component = renderWithWrappers(<FileDownload attachment={attachment as any} />)
  component.root.findByType(AttachmentPreview).props.onSelected()
  expect(Linking.openURL).toBeCalledWith(attachment.downloadURL)
})

const attachment: Omit<FileDownload_attachment, " $refType" | " $fragmentRefs"> = {
  fileName: "This is a great ZIP file telling you all about cats",
  downloadURL: "http://example.com/cats.zip",
}
