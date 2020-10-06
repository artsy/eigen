import { HeaderTabsGridPlaceholder } from "lib/Components/HeaderTabGridPlaceholder"
import { defaultEnvironment } from "lib/relay/createEnvironment"
import { fairFixture } from "lib/Scenes/Fair/__fixtures__"
import { Fair, FairContainer, FairPlaceholder } from "lib/Scenes/Fair/Fair"
import { Fair2FragmentContainer } from "lib/Scenes/Fair2/Fair2"
import { PartnerContainer } from "lib/Scenes/Partner"
import { __appStoreTestUtils__ } from "lib/store/AppStore"
import { renderWithWrappers } from "lib/tests/renderWithWrappers"
import { Spinner } from "palette"
import React from "react"
import { act } from "react-test-renderer"
import { createMockEnvironment } from "relay-test-utils"
import { VanityURLEntityRenderer } from "../VanityURLEntity"
import { VanityURLPossibleRedirect } from "../VanityURLPossibleRedirect"

jest.mock("lib/relay/createEnvironment", () => ({
  defaultEnvironment: require("relay-test-utils").createMockEnvironment(),
}))

jest.unmock("react-relay")

jest.mock("../VanityURLPossibleRedirect", () => {
  return {
    VanityURLPossibleRedirect: () => null,
  }
})

interface RendererProps {
  entity: "fair" | "partner" | "unknown"
  slugType?: "profileID" | "fairID"
  slug: string
}

const TestRenderer: React.FC<RendererProps> = ({ entity, slugType, slug }) => {
  return <VanityURLEntityRenderer entity={entity} slugType={slugType} slug={slug} />
}

describe("VanityURLEntity", () => {
  const env = (defaultEnvironment as any) as ReturnType<typeof createMockEnvironment>

  beforeEach(() => {
    env.mockClear()
  })

  it("renders a fairQueryRenderer when given a fair id", () => {
    const tree = renderWithWrappers(<TestRenderer entity="fair" slugType={"fairID"} slug={"some-fair"} />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("FairQuery")
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          fair: fairFixture,
        },
      })
    })
    const fairComponent = tree.root.findByType(Fair)
    expect(fairComponent).toBeDefined()
  })

  describe("rendering a profile", () => {
    it("shows a fair placeholder when entityType is fair", () => {
      const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      const fairPlaceholder = tree.root.findByType(FairPlaceholder)
      expect(fairPlaceholder).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("shows a partner placeholder when entityType is partner", () => {
      const tree = renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-partner" />)
      const partnerPlaceholder = tree.root.findByType(HeaderTabsGridPlaceholder)
      expect(partnerPlaceholder).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("shows a spinner when entityType is unknown", () => {
      const tree = renderWithWrappers(<TestRenderer entity="unknown" slugType="profileID" slug="some-partner" />)
      const spinner = tree.root.findByType(Spinner)
      expect(spinner).toBeDefined()
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })

    it("renders a partner when a partner is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="partner" slugType="profileID" slug="some-gallery" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              __typename: "Partner",
              id: "some-partner-id",
              internalID: "some-internal-id",
              slug: "some-slug",
              profile: {
                id: "some-profile-id",
                isFollowed: false,
                internalID: "some-internal-profile-id",
              },
            },
          },
        })
      })
      const partnerComponent = tree.root.findByType(PartnerContainer)
      expect(partnerComponent).toBeDefined()
    })

    it("renders a fair when a fair is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              ...fairFixture,
            },
          },
        })
      })
      const fairComponent = tree.root.findByType(FairContainer)
      expect(fairComponent).toBeDefined()
    })

    it("renders a webview when an unknown profile type is returned", () => {
      const tree = renderWithWrappers(<TestRenderer entity="unknown" slugType="profileID" slug="some-unknown-id" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              __typename: "UnknownType",
            },
          },
        })
      })
      const webComponent = tree.root.findByType(VanityURLPossibleRedirect)
      expect(webComponent).toBeDefined()
    })
  })

  describe("rendering a profile with the new fair screen option enabled", () => {
    beforeEach(() => {
      __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })
    })

    afterEach(() => {
      __appStoreTestUtils__?.reset()
    })
    it("renders a new fair page when a fair is returned and the lab option is enabled", () => {
      __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })

      const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="some-fair-profile" />)
      expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
      act(() => {
        env.mock.resolveMostRecentOperation({
          errors: [],
          data: {
            vanityURLEntity: {
              __typename: "Fair",
              ...Fair2Fixture.fair,
            },
          },
        })
      })
      const fairComponent = tree.root.findByType(Fair2FragmentContainer)
      expect(fairComponent).toBeDefined()
    })
  })

  it("renders an old fair page when the lab option is enabled and the slug is configured", () => {
    __appStoreTestUtils__?.injectEmissionOptions({ AROptionsNewFairPage: true })
    __appStoreTestUtils__?.injectState({
      native: { sessionState: { legacyFairSlugs: ["sofa-chicago-2018"] } },
    })
    __appStoreTestUtils__?.injectState({
      native: { sessionState: { legacyFairProfileSlugs: ["old-fair-profile"] } },
    })

    const tree = renderWithWrappers(<TestRenderer entity="fair" slugType="profileID" slug="old-fair-profile" />)
    expect(env.mock.getMostRecentOperation().request.node.operation.name).toBe("VanityURLEntityQuery")
    act(() => {
      env.mock.resolveMostRecentOperation({
        errors: [],
        data: {
          vanityURLEntity: {
            ...fairFixture,
          },
        },
      })
    })
    const fairComponent = tree.root.findByType(FairContainer)
    expect(fairComponent).toBeDefined()
  })
})

const Fair2Fixture = {
  fair: {
    name: "Art Basel Hong Kong 2020",
    slug: "art-basel-hong-kong-2020",
    internalID: "fair1244",
    about:
      "Following the cancelation of Art Basel in Hong Kong, Artsy is providing independent coverage of our partners galleries’ artworks intended for the fair. Available online from March 20th through April 3rd, the online catalogue features premier galleries from Asia and beyond. Concurrent with Artsy’s independent promotion, Art Basel is launching its Online Viewing Rooms, which provide exhibitors with an additional platform to present their program and artists to Art Basel's global network of collectors, buyers, and art enthusiasts.\r\n\r\n",
    summary: "",
    id: "xyz123",
    image: {
      aspectRatio: 1,
      imageUrl: "https://testing.artsy.net/art-basel-hong-kong-image",
    },
    location: {
      id: "cde123",
      summary: null,
    },
    profile: {
      id: "abc123",
      icon: {
        profileUrl: "https://testing.artsy.net/art-basel-hong-kong-icon",
      },
    },
    tagline: "",
    fairLinks: null,
    fairContact: null,
    fairHours: null,
    fairTickets: null,
    ticketsLink: "",
    articles: { edges: [] },
    marketingCollections: [],
    counts: {
      artworks: 0,
      partnerShows: 0,
    },
    fairArtworks: null,
    exhibitors: null,
  },
}
