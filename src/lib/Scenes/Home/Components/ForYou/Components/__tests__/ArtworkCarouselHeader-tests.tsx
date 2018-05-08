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
          _id: "banksy",
          id: "banksy",
        },
      },
      relatedArtistContext: {},
    })
    expect(getSubjectArtist(props)).toEqual(props.rail.followedArtistContext.artist)
  })

  it("fetches the related artist", () => {
    const props = getProps({
      relatedArtistContext: {
        artist: {
          _id: "banksy",
          id: "banksy",
        },
      },
      followedArtistContext: {},
    })
    expect(getSubjectArtist(props)).toEqual(props.rail.relatedArtistContext.artist)
  })
})
