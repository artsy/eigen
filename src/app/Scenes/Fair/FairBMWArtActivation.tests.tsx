import { extractText } from "app/tests/extractText"
import { setupTestWrapper } from "app/tests/setupTestWrapper"
import {
  FAIR_BMW_ART_ACTIVATION_QUERY,
  FairBMWArtActivationFragmentContainer,
} from "./FairBMWArtActivation"

jest.unmock("react-relay")

const { getWrapper } = setupTestWrapper({
  Component: FairBMWArtActivationFragmentContainer,
  query: FAIR_BMW_ART_ACTIVATION_QUERY,
})

it("renders properly", async () => {
  const wrapper = getWrapper({
    FairSponsoredContent: () => ({
      activationText: "Example text",
      pressReleaseUrl: "https://www.example.com/press.pdf",
    }),
  })

  const text = extractText(wrapper.root)
  expect(text).toContain("BMW Art Activations")
  expect(text).toContain("Example text")
})
