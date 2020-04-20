import { Theme } from "@artsy/palette"
import { mount } from "enzyme"
import ImageView from "lib/Components/OpaqueImageView/OpaqueImageView"
import SwitchBoard from "lib/NativeModules/SwitchBoard"
import { CollectionHubRailsArtistSeriesFixture } from "lib/Scenes/Collection/Components/__fixtures__/CollectionFixture"
import { renderRelayTree } from "lib/tests/renderRelayTree"
import React from "react"
import { TouchableOpacity } from "react-native"
import { graphql } from "react-relay"
import {
  ArtistSeriesMeta,
  ArtistSeriesRail,
  ArtistSeriesRailContainer,
  ArtistSeriesTitle,
  ArtworkImageContainer,
  CollectionName,
} from "../ArtistSeriesRail"

jest.unmock("react-relay")
jest.mock("lib/NativeModules/SwitchBoard", () => ({
  presentNavigationViewController: jest.fn(),
}))

it("renders without throwing an error", async () => {
  await renderRelayTree({
    Component: (props: any) => (
      <Theme>
        <ArtistSeriesRailContainer collection={props.marketingCollections} {...props} />
      </Theme>
    ),
    query: graphql`
      query ArtistSeriesRailTestsQuery @raw_response_type {
        marketingCollections(slugs: "photography") {
          linkedCollections {
            groupType
            ...ArtistSeriesRail_collectionGroup
          }
        }
      }
    `,
    mockData: { marketingCollections: CollectionHubRailsArtistSeriesFixture },
  })
})

describe("Trending Artists Rail", () => {
  let props
  beforeEach(() => {
    props = {
      collectionGroup: { ...CollectionHubRailsArtistSeriesFixture },
    }
  })

  it("renders three artist series in the Trending Artists Series", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
      </Theme>
    )

    expect(wrapper.find(ArtworkImageContainer)).toHaveLength(3)
  })

  it("renders three images of the correct size in an artist series", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
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
        .props().style.height
    ).toBe(181)

    expect(
      wrapper
        .find(ImageView)
        .at(0)
        .props().style.width
    ).toBe(178)

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
        .props().style.height
    ).toBe(90)

    expect(
      wrapper
        .find(ImageView)
        .at(1)
        .props().style.width
    ).toBe(89)

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
        .props().style.height
    ).toBe(89)

    expect(
      wrapper
        .find(ImageView)
        .at(2)
        .props().style.width
    ).toBe(89)
  })

  it("renders the collection hub rail title", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
      </Theme>
    )

    expect(wrapper.find(CollectionName).text()).toBe("Trending Artist Series")
  })

  it("renders each artist series' title", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(ArtistSeriesTitle)
        .at(0)
        .text()
    ).toBe("Cindy Sherman: Untitled Film Stills")

    expect(
      wrapper
        .find(ArtistSeriesTitle)
        .at(1)
        .text()
    ).toBe("Damien Hirst: Butterflies")

    expect(
      wrapper
        .find(ArtistSeriesTitle)
        .at(2)
        .text()
    ).toBe("Hunt Slonem: Bunnies")
  })

  it("renders each artist series' metadata", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
      </Theme>
    )

    expect(
      wrapper
        .find(ArtistSeriesMeta)
        .at(0)
        .text()
    ).toBe("From $20,000")

    expect(
      wrapper
        .find(ArtistSeriesMeta)
        .at(1)
        .text()
    ).toBe("From $7,500")

    expect(
      wrapper
        .find(ArtistSeriesMeta)
        .at(2)
        .text()
    ).toBe("From $2,000")
  })

  it("navigates to a new collection when a series is tapped", () => {
    const wrapper = mount(
      <Theme>
        <ArtistSeriesRail {...props} />
      </Theme>
    )

    wrapper
      .find(TouchableOpacity)
      .at(0)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/cindy-sherman-untitled-film-stills"
    )

    wrapper
      .find(TouchableOpacity)
      .at(1)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/damien-hirst-butterflies"
    )

    wrapper
      .find(TouchableOpacity)
      .at(2)
      .props()
      .onPress()

    expect(SwitchBoard.presentNavigationViewController).toHaveBeenCalledWith(
      expect.anything(),
      "/collection/hunt-slonem-bunnies"
    )
  })
})
