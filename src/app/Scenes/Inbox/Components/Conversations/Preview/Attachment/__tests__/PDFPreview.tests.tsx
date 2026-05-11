import PDFPreview from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/PDFPreview"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(
    <PDFPreview
      attachment={attachment as any}
      url="/path/to/cats.pdf"
      mimeType="application/pdf"
      cacheKey="cats"
    />
  )
})

const attachment = {
  id: "cats",
  fileName: "This is a great PDF telling you all about cats",
}
