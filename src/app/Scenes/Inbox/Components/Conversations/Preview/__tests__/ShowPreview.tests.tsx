import ShowPreview from "app/Scenes/Inbox/Components/Conversations/Preview/ShowPreview"
import { renderWithWrappers } from "app/utils/tests/renderWithWrappers"

it("renders without throwing an error", async () => {
  await renderWithWrappers(<ShowPreview show={show as any} />)
})

const show = {
  name: "Catty Show",
  id: "slugID",
  internalID: "mongoID",
  coverImage: {
    url: "https://d32dm0rphc51dk.cloudfront.net/bJ9I_vJX9ksaKFJAkOAIKg/normalized.jpg",
    aspectRatio: 1,
  },
  partner: {
    name: "Catty Partner",
  },
  fair: null,
}
