import { ImagePreview } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/ImagePreview"
import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(
    <ImagePreview attachment={attachment as any} mimeType="image/jpeg" cacheKey="cats" />
  )
})

const attachment = {
  id: "cats",
  downloadURL: "/path/to/cats.jpg",
}
