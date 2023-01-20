import { action, Action } from "easy-peasy"

type ArtworkID = string

export interface ArtQuizModel {
  likedArtworks: ArtworkID[]
  dislikedArtworks: ArtworkID[]

  saveLikedArtwork: Action<this, ArtworkID>
  saveDislikedArtwork: Action<this, ArtworkID>
}

export const getArtQuizModel = (): ArtQuizModel => ({
  likedArtworks: [],
  dislikedArtworks: [],
  saveLikedArtwork: action((state, artworkID) => {
    if (state.likedArtworks.indexOf(artworkID) === -1) {
      state.likedArtworks.push(artworkID)
    }
    if (state.dislikedArtworks.indexOf(artworkID) === -1) {
      state.dislikedArtworks = state.dislikedArtworks.filter((id) => id !== artworkID)
    }
  }),
  saveDislikedArtwork: action((state, artworkID) => {
    if (state.dislikedArtworks.indexOf(artworkID) === -1) {
      state.dislikedArtworks.push(artworkID)
    }
    if (state.likedArtworks.indexOf(artworkID) === -1) {
      state.likedArtworks = state.likedArtworks.filter((id) => id !== artworkID)
    }
  }),
})
