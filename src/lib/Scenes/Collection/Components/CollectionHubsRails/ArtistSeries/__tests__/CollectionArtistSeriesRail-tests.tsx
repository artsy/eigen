import { Theme } from "@artsy/palette"
// @ts-ignore STRICTNESS_MIGRATION
import { mount } from "enzyme"
import {
  GenericArtistSeriesMeta,
  GenericArtistSeriesRail,
  GenericArtistSeriesTitle,
} from "lib/Components/GenericArtistSeriesRail"
import { CardRailArtworkImageContainer as ArtworkImageContainer, CardRailCard } from "lib/Components/Home/CardRailCard"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CollectionHubRailsArtistSeriesFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import {
  CollectionArtistSeriesRail,
  CollectionArtistSeriesRailContainer,
  CollectionName,
} from "lib/Scenes/Collection/Components/CollectionHubsRails/ArtistSeries/CollectionArtistSeriesRail"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { graphql } from "react-relay"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

it("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <Theme>
        <CollectionArtistSeriesRailContainer collection={props.marketingCollections} {...props} />
      </Theme>
    ),
    query: graphql`
      query CollectionArtistSeriesRailTestsQuery @raw_response_type {
        marketingCollections(slugs: "photography") {
          linkedCollections {
            groupType
            ...CollectionArtistSeriesRail_collectionGroup
          }
        }
      }
    `,
    mockData: { marketingCollections: CollectionHubRailsArtistSeriesFixture },
  })
})

describe("Trending Artists Rail", () => {
  let props: any /* STRICTNESS_MIGRATION */
  beforeEach(() => {
    props = {
      collectionGroup: { ...CollectionHubRailsArtistSeriesFixture },
    }
  })

  it("renders the Trending Artists Series rail component", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(wrapper.find(GenericArtistSeriesRail)).toHaveLength(1)
  })

  it("renders three artist series in the Trending Artists Series", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(wrapper.find(ArtworkImageContainer)).toHaveLength(3)
  })

  it("renders three images of the correct size in an artist series", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(ImageView)
        .at(0)
        .props().imageURL
    ).toBe("https://cindy-sherman-untitled-film-stills/medium.jpg")

    expect(
      wrapper
        .find(ImageView)
        .at(0)
        .props().height
    ).toBe(180)

    expect(
      wrapper
        .find(ImageView)
        .at(0)
        .props().width
    ).toBe(180)

    expect(
      wrapper
        .find(ImageView)
        .at(1)
        .props().imageURL
    ).toBe("https://cindy-sherman-untitled-film-stills-2/medium.jpg")

    expect(
      wrapper
        .find(ImageView)
        .at(1)
        .props().height
    ).toBe(90)

    expect(
      wrapper
        .find(ImageView)
        .at(1)
        .props().width
    ).toBe(90)

    expect(
      wrapper
        .find(ImageView)
        .at(2)
        .props().imageURL
    ).toBe("https://cindy-sherman-untitled-film-stills-3/medium.jpg")

    expect(
      wrapper
        .find(ImageView)
        .at(2)
        .props().height
    ).toBe(88)

    expect(
      wrapper
        .find(ImageView)
        .at(2)
        .props().width
    ).toBe(90)
  })

  it("renders the collection hub rail title", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(wrapper.find(CollectionName).text()).toBe("Trending Artist Series")
  })

  it("renders each artist series' title", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(GenericArtistSeriesTitle)
        .at(0)
        .text()
    ).toBe("Cindy Sherman: Untitled Film Stills")

    expect(
      wrapper
        .find(GenericArtistSeriesTitle)
        .at(1)
        .text()
    ).toBe("Damien Hirst: Butterflies")

    expect(
      wrapper
        .find(GenericArtistSeriesTitle)
        .at(2)
        .text()
    ).toBe("Hunt Slonem: Bunnies")
  })

  it("renders each artist series' metadata", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(GenericArtistSeriesMeta)
        .at(0)
        .text()
    ).toBe("From $20,000")

    expect(
      wrapper
        .find(GenericArtistSeriesMeta)
        .at(1)
        .text()
    ).toBe("From $7,500")

    expect(
      wrapper
        .find(GenericArtistSeriesMeta)
        .at(2)
        .text()
    ).toBe("From $2,000")
  })

  it("navigates to a new collection when a series is tapped", () => {
    const wrapper = mount(
      <Theme>
        <CollectionArtistSeriesRail {...props} />
      </Theme>
    )

    wrapper
      .find(CardRailCard)
      .at(0)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/cindy-sherman-untitled-film-stills"
    )

    wrapper
      .find(CardRailCard)
      .at(1)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/damien-hirst-butterflies"
    )

    wrapper
      .find(CardRailCard)
      .at(2)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/hunt-slonem-bunnies"
    )
  })
})
