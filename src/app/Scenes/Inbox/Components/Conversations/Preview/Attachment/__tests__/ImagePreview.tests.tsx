import { renderWithWrappersLEGACY } from "app/utils/tests/renderWithWrappers"
import "react-native"

import { ImagePreview } from "app/Scenes/Inbox/Components/Conversations/Preview/Attachment/ImagePreview"

it("renders without throwing an error", () => {
  renderWithWrappersLEGACY(<ImagePreview attachment={attachment as any} />)
})

const attachment = {
  id: "cats",
  downloadURL: "/path/to/cats.jpg",
}
