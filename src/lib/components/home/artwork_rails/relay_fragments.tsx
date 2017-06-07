"use strict"

import * as Relay from "react-relay"

function relatedArtistFragment() {
  return Relay.QL`
      fragment related_artists_context on HomePageModuleContextRelatedArtist {
        artist {
          href
          id
        }
        based_on {
          name
        }
      }
    `
}

function geneFragment() {
  return Relay.QL`
      fragment gene_context on HomePageModuleContextGene {
        href
      }
    `
}

function auctionFragment() {
  return Relay.QL`
      fragment auction_context on HomePageModuleContextSale {
        href
      }
    `
}

function fairFragment() {
  return Relay.QL`
      fragment fair_context on HomePageModuleContextFair {
        href
      }
    `
}

function followedArtistFragment() {
  return Relay.QL`
      fragment followed_artist_context on HomePageModuleContextFollowedArtist {
        artist {
          href
          id
        }
      }
    `
}

export default {
  relatedArtistFragment,
  geneFragment,
  auctionFragment,
  fairFragment,
  followedArtistFragment,
}
