import { getSubjectArtist } from "../ArtworkCarouselHeader"

describe("getSubjectArtist", () => {
  function getProps(context, typename: "HomePageFollowedArtistArtworkModule" | "HomePageRelatedArtistArtworkModule") {
    return {
      rail: {
        title: "A followed artist rail",
        key: "followed_artist",
        context: {
          ...context,
          __typename: typename,
        },
      },
      handleViewAll: () => null,
    }
  }

  it("fetches the followed artist", () => {
    const props = getProps(
      {
        artist: {
          internalID: "banksy",
          id: "banksy",
        },
      },
      "HomePageFollowedArtistArtworkModule"
    )
    expect(getSubjectArtist(props as any)).toEqual(props.rail.context.artist)
  })

  it("fetches the related artist", () => {
    const props = getProps(
      {
        artist: {
          internalID: "banksy",
          id: "banksy",
        },
      },
      "HomePageRelatedArtistArtworkModule"
    )
    expect(getSubjectArtist(props as any)).toEqual(props.rail.context.artist)
  })
})
