import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

import PDFPreview from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/PDFPreview"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<PDFPreview attachment={attachment as any} />)
})

const attachment = {
  id: "cats",
  fileName: "This is a great PDF telling you all about cats",
}
