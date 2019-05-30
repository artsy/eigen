import { getSubjectArtist } from "../ArtworkCarouselHeader"

describe("getSubjectArtist", () => {
  function getProps({ followedArtistContext, relatedArtistContext }) {
    return {
      rail: {
        title: "A followed artist rail",
        key: "followed_artist",
        followedArtistContext,
        relatedArtistContext,
      },
      handleViewAll: () => null,
    }
  }

  it("fetches the followed artist", () => {
    const props = getProps({
      followedArtistContext: {
        artist: {
          internalID: "banksy",
          id: "banksy",
        },
      },
      relatedArtistContext: {},
    })
    expect(getSubjectArtist(props as any)).toEqual(props.rail.followedArtistContext.artist)
  })

  it("fetches the related artist", () => {
    const props = getProps({
      relatedArtistContext: {
        artist: {
          internalID: "banksy",
          id: "banksy",
        },
      },
      followedArtistContext: {},
    })
    expect(getSubjectArtist(props as any)).toEqual(props.rail.relatedArtistContext.artist)
  })
})
