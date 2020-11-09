/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2a0f9b922b1e9699fd7da1c672bafb74 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntityQueryVariables = {
    id: string;
    useNewFairView: boolean;
};
export type VanityURLEntityQueryResponse = {
    readonly vanityURLEntity: {
        readonly " $fragmentRefs": FragmentRefs<"VanityURLEntity_fairOrPartner">;
    } | null;
};
export type VanityURLEntityQuery = {
    readonly response: VanityURLEntityQueryResponse;
    readonly variables: VanityURLEntityQueryVariables;
};



/*
query VanityURLEntityQuery(
  $id: String!
  $useNewFairView: Boolean!
) {
  vanityURLEntity(id: $id) {
    __typename
    ...VanityURLEntity_fairOrPartner_18FOGk
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment ArtistListItem_artist on Artist {
  id
  internalID
  slug
  name
  initials
  href
  is_followed: isFollowed
  nationality
  birthday
  deathday
  image {
    url
  }
}

fragment ArtworkGridItem_artwork on Artwork {
  title
  date
  saleMessage
  slug
  internalID
  artistNames
  href
  sale {
    isAuction
    isClosed
    displayTimelyAt
    endAt
    id
  }
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    lotLabel
    id
  }
  partner {
    name
    id
  }
  image {
    url(version: "large")
    aspectRatio
  }
}

fragment ArtworkTileRailCard_artwork on Artwork {
  slug
  internalID
  href
  artistNames
  image {
    imageURL
  }
  saleMessage
}

fragment Fair2Artworks_fair on Fair {
  slug
  internalID
  fairArtworks: filterArtworksConnection(first: 30, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST]) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    counts {
      total
      followedArtists
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
  }
}

fragment Fair2Collections_fair on Fair {
  internalID
  slug
  marketingCollections(size: 5) {
    slug
    title
    category
    artworks: artworksConnection(first: 3) {
      edges {
        node {
          image {
            url(version: "larger")
          }
          id
        }
      }
      id
    }
    id
  }
}

fragment Fair2Editorial_fair on Fair {
  internalID
  slug
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    edges {
      node {
        id
        internalID
        slug
        title
        href
        publishedAt(format: "MMM Do, YYYY")
        thumbnailImage {
          src: imageURL
        }
      }
    }
  }
}

fragment Fair2ExhibitorRail_show on Show {
  internalID
  slug
  href
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on ExternalPartner {
      name
      id
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
  counts {
    artworks
  }
  fair {
    internalID
    slug
    id
  }
  artworks: artworksConnection(first: 20) {
    edges {
      node {
        href
        artistNames
        id
        image {
          imageURL
          aspectRatio
        }
        saleMessage
        saleArtwork {
          openingBid {
            display
          }
          highestBid {
            display
          }
          currentBid {
            display
          }
          counts {
            bidderPositions
          }
          id
        }
        sale {
          isClosed
          isAuction
          endAt
          id
        }
        title
        internalID
        slug
      }
    }
  }
}

fragment Fair2Exhibitors_fair on Fair {
  internalID
  slug
  exhibitors: showsConnection(first: 30, sort: FEATURED_ASC) {
    edges {
      node {
        id
        counts {
          artworks
        }
        partner {
          __typename
          ... on Partner {
            id
          }
          ... on ExternalPartner {
            id
          }
          ... on Node {
            __isNode: __typename
            id
          }
        }
        ...Fair2ExhibitorRail_show
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment Fair2FollowedArtistsRail_fair on Fair {
  internalID
  slug
  followedArtistArtworks: filterArtworksConnection(includeArtworksByFollowedArtists: true, first: 20) {
    edges {
      artwork: node {
        id
        internalID
        slug
        ...ArtworkTileRailCard_artwork
      }
    }
    id
  }
}

fragment Fair2Header_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      imageUrl: url(version: "untouched-png")
    }
    id
  }
  image {
    imageUrl: url(version: "large_rectangle")
    aspectRatio
  }
  tagline
  location {
    summary
    coordinates {
      lat
      lng
    }
    id
  }
  ticketsLink
  sponsoredContent {
    activationText
    pressReleaseUrl
  }
  fairHours: hours(format: MARKDOWN)
  fairLinks: links(format: MARKDOWN)
  fairTickets: tickets(format: MARKDOWN)
  fairContact: contact(format: MARKDOWN)
  ...Fair2Timing_fair
}

fragment Fair2Timing_fair on Fair {
  exhibitionPeriod
  startAt
  endAt
}

fragment Fair2_fair on Fair {
  internalID
  slug
  isActive
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    edges {
      __typename
    }
  }
  marketingCollections(size: 5) {
    __typename
    id
  }
  counts {
    artworks
    partnerShows
  }
  followedArtistArtworks: filterArtworksConnection(includeArtworksByFollowedArtists: true, first: 20) {
    edges {
      __typename
    }
    id
  }
  ...Fair2Header_fair
  ...Fair2Editorial_fair
  ...Fair2Collections_fair
  ...Fair2Artworks_fair
  ...Fair2Exhibitors_fair
  ...Fair2FollowedArtistsRail_fair
}

fragment FairBoothPreview_show on Show {
  slug
  internalID
  counts {
    artworks
  }
  partner {
    __typename
    ... on Partner {
      name
      href
      slug
      internalID
      id
      profile {
        id
        slug
        internalID
        isFollowed
      }
    }
    ... on Node {
      __isNode: __typename
      id
    }
    ... on ExternalPartner {
      id
    }
  }
  coverImage {
    url
  }
  location {
    display
    id
  }
  artworks: artworksConnection(first: 4) {
    edges {
      node {
        ...GenericGrid_artworks
        id
      }
    }
  }
}

fragment FairDetail_fair on Fair {
  ...FairHeader_fair
  slug
  internalID
  name
  hours
  isActive
  location {
    ...LocationMap_location
    ...HoursCollapsible_location
    coordinates {
      lat
      lng
    }
    id
  }
  organizer {
    website
    id
  }
  profile {
    name
    id
  }
  sponsoredContent {
    pressReleaseUrl
    activationText
  }
  shows: showsConnection(first: 5) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      cursor
      node {
        artworks: artworksConnection(first: 4) {
          edges {
            node {
              slug
              id
            }
          }
        }
        ...FairBoothPreview_show
        id
        __typename
      }
    }
  }
}

fragment FairHeader_fair on Fair {
  slug
  name
  formattedOpeningHours
  startAt
  endAt
  exhibitionPeriod
  counts {
    artists
  }
  image {
    url
  }
  followedContent {
    artists {
      name
      href
      slug
      internalID
      id
    }
  }
  artistsConnection(first: 3) {
    edges {
      node {
        name
        href
        slug
        internalID
        id
      }
    }
  }
  profile {
    id
    icon {
      url(version: "square140")
    }
  }
}

fragment Fair_fair on Fair {
  id
  ...FairDetail_fair
}

fragment GenericGrid_artworks on Artwork {
  id
  image {
    aspect_ratio: aspectRatio
  }
  ...ArtworkGridItem_artwork
}

fragment HoursCollapsible_location on Location {
  openingHours {
    __typename
    ... on OpeningHoursArray {
      schedules {
        days
        hours
      }
    }
    ... on OpeningHoursText {
      text
    }
  }
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
  __isArtworkConnectionInterface: __typename
  pageInfo {
    hasNextPage
    startCursor
    endCursor
  }
  edges {
    __typename
    node {
      slug
      id
      image {
        aspectRatio
      }
      ...ArtworkGridItem_artwork
    }
    ... on Node {
      __isNode: __typename
      id
    }
  }
}

fragment LocationMap_location on Location {
  id
  internalID
  city
  address
  address2
  postalCode
  summary
  coordinates {
    lat
    lng
  }
}

fragment PartnerArtwork_partner on Partner {
  internalID
  artworks: artworksConnection(sort: PARTNER_UPDATED_AT_DESC, first: 10) {
    edges {
      node {
        id
        __typename
      }
      cursor
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
  }
}

fragment PartnerFollowButton_partner on Partner {
  internalID
  slug
  profile {
    id
    internalID
    isFollowed
  }
}

fragment PartnerHeader_partner on Partner {
  name
  profile {
    name
    id
  }
  counts {
    eligibleArtworks
  }
  ...PartnerFollowButton_partner
}

fragment PartnerLocationSection_partner on Partner {
  slug
  name
  cities
  locations: locationsConnection(first: 0) {
    totalCount
  }
}

fragment PartnerOverview_partner on Partner {
  internalID
  name
  cities
  profile {
    bio
    id
  }
  artists: artistsConnection(sort: SORTABLE_ID_ASC, first: 10) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        id
        ...ArtistListItem_artist
        counts {
          artworks
        }
        __typename
      }
      cursor
      id
    }
  }
  ...PartnerLocationSection_partner
}

fragment PartnerShowRailItem_show on Show {
  internalID
  slug
  name
  exhibitionPeriod
  endAt
  coverImage {
    url
  }
  images {
    url
  }
}

fragment PartnerShowsRail_partner on Partner {
  internalID
  currentAndUpcomingShows: showsConnection(status: CURRENT, sort: END_AT_ASC, first: 6) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        internalID
        slug
        name
        exhibitionPeriod
        endAt
        images {
          url
        }
        partner {
          __typename
          ... on Partner {
            name
          }
          ... on Node {
            __isNode: __typename
            id
          }
          ... on ExternalPartner {
            id
          }
        }
        ...PartnerShowRailItem_show
        __typename
      }
      cursor
    }
  }
}

fragment PartnerShows_partner on Partner {
  slug
  internalID
  recentShows: showsConnection(status: CURRENT, first: 10) {
    edges {
      node {
        id
        isDisplayable
      }
    }
  }
  pastShows: showsConnection(status: CLOSED, sort: END_AT_DESC, first: 32) {
    pageInfo {
      hasNextPage
      startCursor
      endCursor
    }
    edges {
      node {
        isDisplayable
        id
        name
        slug
        exhibitionPeriod
        coverImage {
          url
          aspectRatio
        }
        href
        __typename
      }
      cursor
    }
  }
  ...PartnerShowsRail_partner
}

fragment Partner_partner on Partner {
  id
  internalID
  slug
  profile {
    id
    isFollowed
    internalID
  }
  ...PartnerArtwork_partner
  ...PartnerOverview_partner
  ...PartnerShows_partner
  ...PartnerHeader_partner
}

fragment VanityURLEntity_fairOrPartner_18FOGk on VanityURLEntityType {
  __isVanityURLEntityType: __typename
  __typename
  ... on Fair {
    slug
    ...Fair2_fair @include(if: $useNewFairView)
    ...Fair_fair @skip(if: $useNewFairView)
  }
  ... on Partner {
    ...Partner_partner
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "id"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "useNewFairView"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "id"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isActive",
  "storageKey": null
},
v6 = {
  "kind": "Literal",
  "name": "first",
  "value": 5
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v10 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 3
  }
],
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworks",
  "storageKey": null
},
v12 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "concreteType": "LatLng",
  "kind": "LinkedField",
  "name": "coordinates",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lat",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lng",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "activationText",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "pressReleaseUrl",
  "storageKey": null
},
v22 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startAt",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v26 = {
  "kind": "Literal",
  "name": "first",
  "value": 30
},
v27 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "COLOR",
      "DIMENSION_RANGE",
      "GALLERY",
      "INSTITUTION",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE",
      "FOLLOWED_ARTISTS",
      "ARTIST"
    ]
  },
  {
    "kind": "Literal",
    "name": "dimensionRange",
    "value": "*-*"
  },
  (v26/*: any*/),
  {
    "kind": "Literal",
    "name": "medium",
    "value": "*"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "-decayed_merch"
  }
],
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v29 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v7/*: any*/),
      (v2/*: any*/)
    ],
    "storageKey": null
  },
  (v28/*: any*/)
],
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v32 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v30/*: any*/),
    (v31/*: any*/)
  ],
  "storageKey": null
},
v33 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startCursor",
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "version",
      "value": "large"
    }
  ],
  "kind": "ScalarField",
  "name": "url",
  "storageKey": "url(version:\"large\")"
},
v35 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v36 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v37 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v38 = {
  "alias": null,
  "args": null,
  "concreteType": "Sale",
  "kind": "LinkedField",
  "name": "sale",
  "plural": false,
  "selections": [
    (v36/*: any*/),
    (v37/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "displayTimelyAt",
      "storageKey": null
    },
    (v25/*: any*/),
    (v7/*: any*/)
  ],
  "storageKey": null
},
v39 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "kind": "LinkedField",
  "name": "counts",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bidderPositions",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v40 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "display",
  "storageKey": null
},
v41 = [
  (v40/*: any*/)
],
v42 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": (v41/*: any*/),
  "storageKey": null
},
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtwork",
  "kind": "LinkedField",
  "name": "saleArtwork",
  "plural": false,
  "selections": [
    (v39/*: any*/),
    (v42/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "lotLabel",
      "storageKey": null
    },
    (v7/*: any*/)
  ],
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v17/*: any*/),
    (v7/*: any*/)
  ],
  "storageKey": null
},
v45 = [
  (v7/*: any*/)
],
v46 = {
  "kind": "InlineFragment",
  "selections": (v45/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v47 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "PageInfo",
      "kind": "LinkedField",
      "name": "pageInfo",
      "plural": false,
      "selections": [
        (v33/*: any*/)
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": null,
      "kind": "LinkedField",
      "name": "edges",
      "plural": true,
      "selections": [
        (v2/*: any*/),
        {
          "alias": null,
          "args": null,
          "concreteType": "Artwork",
          "kind": "LinkedField",
          "name": "node",
          "plural": false,
          "selections": [
            (v3/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Image",
              "kind": "LinkedField",
              "name": "image",
              "plural": false,
              "selections": [
                (v18/*: any*/),
                (v34/*: any*/)
              ],
              "storageKey": null
            },
            (v8/*: any*/),
            (v35/*: any*/),
            (v15/*: any*/),
            (v4/*: any*/),
            (v13/*: any*/),
            (v9/*: any*/),
            (v38/*: any*/),
            (v43/*: any*/),
            (v44/*: any*/)
          ],
          "storageKey": null
        },
        (v46/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ArtworkConnectionInterface",
  "abstractKey": "__isArtworkConnectionInterface"
},
v48 = [
  (v26/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v49 = [
  (v11/*: any*/)
],
v50 = {
  "alias": null,
  "args": null,
  "concreteType": "ShowCounts",
  "kind": "LinkedField",
  "name": "counts",
  "plural": false,
  "selections": (v49/*: any*/),
  "storageKey": null
},
v51 = [
  (v7/*: any*/),
  (v17/*: any*/)
],
v52 = [
  "sort"
],
v53 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v54 = [
  (v53/*: any*/)
],
v55 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "image",
  "plural": false,
  "selections": (v54/*: any*/),
  "storageKey": null
},
v56 = [
  (v17/*: any*/),
  (v9/*: any*/),
  (v3/*: any*/),
  (v4/*: any*/),
  (v7/*: any*/)
],
v57 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hours",
  "storageKey": null
},
v58 = [
  (v6/*: any*/)
],
v59 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v31/*: any*/),
    (v33/*: any*/),
    (v30/*: any*/)
  ],
  "storageKey": null
},
v60 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isFollowed",
  "storageKey": null
},
v61 = {
  "kind": "InlineFragment",
  "selections": (v45/*: any*/),
  "type": "ExternalPartner",
  "abstractKey": null
},
v62 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
  "plural": false,
  "selections": (v54/*: any*/),
  "storageKey": null
},
v63 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v64 = [
  (v63/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "PARTNER_UPDATED_AT_DESC"
  }
],
v65 = [
  (v63/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "SORTABLE_ID_ASC"
  }
],
v66 = {
  "kind": "Literal",
  "name": "status",
  "value": "CURRENT"
},
v67 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDisplayable",
  "storageKey": null
},
v68 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 32
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_DESC"
  },
  {
    "kind": "Literal",
    "name": "status",
    "value": "CLOSED"
  }
],
v69 = [
  "status",
  "sort"
],
v70 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 6
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "END_AT_ASC"
  },
  (v66/*: any*/)
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "VanityURLEntityQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "vanityURLEntity",
        "plural": false,
        "selections": [
          {
            "args": [
              {
                "kind": "Variable",
                "name": "useNewFairView",
                "variableName": "useNewFairView"
              }
            ],
            "kind": "FragmentSpread",
            "name": "VanityURLEntity_fairOrPartner"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "VanityURLEntityQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "vanityURLEntity",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isVanityURLEntityType"
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v3/*: any*/),
              {
                "condition": "useNewFairView",
                "kind": "Condition",
                "passingValue": true,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": "articles",
                    "args": [
                      (v6/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "sort",
                        "value": "PUBLISHED_AT_DESC"
                      }
                    ],
                    "concreteType": "ArticleConnection",
                    "kind": "LinkedField",
                    "name": "articlesConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArticleEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Article",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v4/*: any*/),
                              (v3/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "format",
                                    "value": "MMM Do, YYYY"
                                  }
                                ],
                                "kind": "ScalarField",
                                "name": "publishedAt",
                                "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "thumbnailImage",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": "src",
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "imageURL",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")"
                  },
                  {
                    "alias": null,
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "size",
                        "value": 5
                      }
                    ],
                    "concreteType": "MarketingCollection",
                    "kind": "LinkedField",
                    "name": "marketingCollections",
                    "plural": true,
                    "selections": [
                      (v2/*: any*/),
                      (v7/*: any*/),
                      (v3/*: any*/),
                      (v8/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "category",
                        "storageKey": null
                      },
                      {
                        "alias": "artworks",
                        "args": (v10/*: any*/),
                        "concreteType": "FilterArtworksConnection",
                        "kind": "LinkedField",
                        "name": "artworksConnection",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "FilterArtworksEdge",
                            "kind": "LinkedField",
                            "name": "edges",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "kind": "LinkedField",
                                "name": "node",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": [
                                          {
                                            "kind": "Literal",
                                            "name": "version",
                                            "value": "larger"
                                          }
                                        ],
                                        "kind": "ScalarField",
                                        "name": "url",
                                        "storageKey": "url(version:\"larger\")"
                                      }
                                    ],
                                    "storageKey": null
                                  },
                                  (v7/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": "artworksConnection(first:3)"
                      }
                    ],
                    "storageKey": "marketingCollections(size:5)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FairCounts",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": false,
                    "selections": [
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "partnerShows",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "followedArtistArtworks",
                    "args": [
                      (v12/*: any*/),
                      {
                        "kind": "Literal",
                        "name": "includeArtworksByFollowedArtists",
                        "value": true
                      }
                    ],
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "filterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "alias": "artwork",
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v4/*: any*/),
                              (v3/*: any*/),
                              (v9/*: any*/),
                              (v13/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  (v14/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v15/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": "filterArtworksConnection(first:20,includeArtworksByFollowedArtists:true)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "about",
                    "storageKey": null
                  },
                  (v16/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "icon",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "imageUrl",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "untouched-png"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"untouched-png\")"
                          }
                        ],
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Image",
                    "kind": "LinkedField",
                    "name": "image",
                    "plural": false,
                    "selections": [
                      {
                        "alias": "imageUrl",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "version",
                            "value": "large_rectangle"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": "url(version:\"large_rectangle\")"
                      },
                      (v18/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "tagline",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      (v16/*: any*/),
                      (v19/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "ticketsLink",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FairSponsoredContent",
                    "kind": "LinkedField",
                    "name": "sponsoredContent",
                    "plural": false,
                    "selections": [
                      (v20/*: any*/),
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "fairHours",
                    "args": (v22/*: any*/),
                    "kind": "ScalarField",
                    "name": "hours",
                    "storageKey": "hours(format:\"MARKDOWN\")"
                  },
                  {
                    "alias": "fairLinks",
                    "args": (v22/*: any*/),
                    "kind": "ScalarField",
                    "name": "links",
                    "storageKey": "links(format:\"MARKDOWN\")"
                  },
                  {
                    "alias": "fairTickets",
                    "args": (v22/*: any*/),
                    "kind": "ScalarField",
                    "name": "tickets",
                    "storageKey": "tickets(format:\"MARKDOWN\")"
                  },
                  {
                    "alias": "fairContact",
                    "args": (v22/*: any*/),
                    "kind": "ScalarField",
                    "name": "contact",
                    "storageKey": "contact(format:\"MARKDOWN\")"
                  },
                  (v23/*: any*/),
                  (v24/*: any*/),
                  (v25/*: any*/),
                  {
                    "alias": "fairArtworks",
                    "args": (v27/*: any*/),
                    "concreteType": "FilterArtworksConnection",
                    "kind": "LinkedField",
                    "name": "filterArtworksConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtworksAggregationResults",
                        "kind": "LinkedField",
                        "name": "aggregations",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "slice",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AggregationCount",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "count",
                                "storageKey": null
                              },
                              (v17/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "value",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FilterArtworksEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": (v29/*: any*/),
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "FilterArtworksCounts",
                        "kind": "LinkedField",
                        "name": "counts",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "total",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "followedArtists",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v32/*: any*/),
                      (v7/*: any*/),
                      (v47/*: any*/)
                    ],
                    "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],dimensionRange:\"*-*\",first:30,medium:\"*\",sort:\"-decayed_merch\")"
                  },
                  {
                    "alias": "fairArtworks",
                    "args": (v27/*: any*/),
                    "filters": [
                      "sort",
                      "medium",
                      "priceRange",
                      "color",
                      "partnerID",
                      "dimensionRange",
                      "majorPeriods",
                      "acquireable",
                      "inquireableOnly",
                      "atAuction",
                      "offerable",
                      "includeArtworksByFollowedArtists",
                      "artistIDs",
                      "aggregations"
                    ],
                    "handle": "connection",
                    "key": "Fair_fairArtworks",
                    "kind": "LinkedHandle",
                    "name": "filterArtworksConnection"
                  },
                  {
                    "alias": "exhibitors",
                    "args": (v48/*: any*/),
                    "concreteType": "ShowConnection",
                    "kind": "LinkedField",
                    "name": "showsConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ShowEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Show",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v50/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "partner",
                                "plural": false,
                                "selections": [
                                  (v2/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "selections": (v51/*: any*/),
                                    "type": "Partner",
                                    "abstractKey": null
                                  },
                                  {
                                    "kind": "InlineFragment",
                                    "selections": (v51/*: any*/),
                                    "type": "ExternalPartner",
                                    "abstractKey": null
                                  },
                                  (v46/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v4/*: any*/),
                              (v3/*: any*/),
                              (v9/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Fair",
                                "kind": "LinkedField",
                                "name": "fair",
                                "plural": false,
                                "selections": [
                                  (v4/*: any*/),
                                  (v3/*: any*/),
                                  (v7/*: any*/)
                                ],
                                "storageKey": null
                              },
                              {
                                "alias": "artworks",
                                "args": [
                                  (v12/*: any*/)
                                ],
                                "concreteType": "ArtworkConnection",
                                "kind": "LinkedField",
                                "name": "artworksConnection",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ArtworkEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Artwork",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v9/*: any*/),
                                          (v13/*: any*/),
                                          (v7/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Image",
                                            "kind": "LinkedField",
                                            "name": "image",
                                            "plural": false,
                                            "selections": [
                                              (v14/*: any*/),
                                              (v18/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          (v15/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "SaleArtwork",
                                            "kind": "LinkedField",
                                            "name": "saleArtwork",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "SaleArtworkOpeningBid",
                                                "kind": "LinkedField",
                                                "name": "openingBid",
                                                "plural": false,
                                                "selections": (v41/*: any*/),
                                                "storageKey": null
                                              },
                                              {
                                                "alias": null,
                                                "args": null,
                                                "concreteType": "SaleArtworkHighestBid",
                                                "kind": "LinkedField",
                                                "name": "highestBid",
                                                "plural": false,
                                                "selections": (v41/*: any*/),
                                                "storageKey": null
                                              },
                                              (v42/*: any*/),
                                              (v39/*: any*/),
                                              (v7/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Sale",
                                            "kind": "LinkedField",
                                            "name": "sale",
                                            "plural": false,
                                            "selections": [
                                              (v37/*: any*/),
                                              (v36/*: any*/),
                                              (v25/*: any*/),
                                              (v7/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          (v8/*: any*/),
                                          (v4/*: any*/),
                                          (v3/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "artworksConnection(first:20)"
                              },
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v28/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v32/*: any*/)
                    ],
                    "storageKey": "showsConnection(first:30,sort:\"FEATURED_ASC\")"
                  },
                  {
                    "alias": "exhibitors",
                    "args": (v48/*: any*/),
                    "filters": (v52/*: any*/),
                    "handle": "connection",
                    "key": "Fair2ExhibitorsQuery_exhibitors",
                    "kind": "LinkedHandle",
                    "name": "showsConnection"
                  }
                ]
              },
              {
                "condition": "useNewFairView",
                "kind": "Condition",
                "passingValue": false,
                "selections": [
                  (v7/*: any*/),
                  (v17/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "formattedOpeningHours",
                    "storageKey": null
                  },
                  (v24/*: any*/),
                  (v25/*: any*/),
                  (v23/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FairCounts",
                    "kind": "LinkedField",
                    "name": "counts",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "artists",
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v55/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FollowedContent",
                    "kind": "LinkedField",
                    "name": "followedContent",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artists",
                        "plural": true,
                        "selections": (v56/*: any*/),
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": (v10/*: any*/),
                    "concreteType": "ArtistConnection",
                    "kind": "LinkedField",
                    "name": "artistsConnection",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ArtistEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": (v56/*: any*/),
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "artistsConnection(first:3)"
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Profile",
                    "kind": "LinkedField",
                    "name": "profile",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "icon",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "square140"
                              }
                            ],
                            "kind": "ScalarField",
                            "name": "url",
                            "storageKey": "url(version:\"square140\")"
                          }
                        ],
                        "storageKey": null
                      },
                      (v17/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  (v57/*: any*/),
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Location",
                    "kind": "LinkedField",
                    "name": "location",
                    "plural": false,
                    "selections": [
                      (v7/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "city",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "address",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "address2",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "postalCode",
                        "storageKey": null
                      },
                      (v16/*: any*/),
                      (v19/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": null,
                        "kind": "LinkedField",
                        "name": "openingHours",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "FormattedDaySchedules",
                                "kind": "LinkedField",
                                "name": "schedules",
                                "plural": true,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "days",
                                    "storageKey": null
                                  },
                                  (v57/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "OpeningHoursArray",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "text",
                                "storageKey": null
                              }
                            ],
                            "type": "OpeningHoursText",
                            "abstractKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "organizer",
                    "kind": "LinkedField",
                    "name": "organizer",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "website",
                        "storageKey": null
                      },
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "FairSponsoredContent",
                    "kind": "LinkedField",
                    "name": "sponsoredContent",
                    "plural": false,
                    "selections": [
                      (v21/*: any*/),
                      (v20/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": "shows",
                    "args": (v58/*: any*/),
                    "concreteType": "ShowConnection",
                    "kind": "LinkedField",
                    "name": "showsConnection",
                    "plural": false,
                    "selections": [
                      (v59/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "ShowEdge",
                        "kind": "LinkedField",
                        "name": "edges",
                        "plural": true,
                        "selections": [
                          (v28/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Show",
                            "kind": "LinkedField",
                            "name": "node",
                            "plural": false,
                            "selections": [
                              {
                                "alias": "artworks",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "first",
                                    "value": 4
                                  }
                                ],
                                "concreteType": "ArtworkConnection",
                                "kind": "LinkedField",
                                "name": "artworksConnection",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "ArtworkEdge",
                                    "kind": "LinkedField",
                                    "name": "edges",
                                    "plural": true,
                                    "selections": [
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Artwork",
                                        "kind": "LinkedField",
                                        "name": "node",
                                        "plural": false,
                                        "selections": [
                                          (v3/*: any*/),
                                          (v7/*: any*/),
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "Image",
                                            "kind": "LinkedField",
                                            "name": "image",
                                            "plural": false,
                                            "selections": [
                                              {
                                                "alias": "aspect_ratio",
                                                "args": null,
                                                "kind": "ScalarField",
                                                "name": "aspectRatio",
                                                "storageKey": null
                                              },
                                              (v34/*: any*/),
                                              (v18/*: any*/)
                                            ],
                                            "storageKey": null
                                          },
                                          (v8/*: any*/),
                                          (v35/*: any*/),
                                          (v15/*: any*/),
                                          (v4/*: any*/),
                                          (v13/*: any*/),
                                          (v9/*: any*/),
                                          (v38/*: any*/),
                                          (v43/*: any*/),
                                          (v44/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": "artworksConnection(first:4)"
                              },
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v50/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": null,
                                "kind": "LinkedField",
                                "name": "partner",
                                "plural": false,
                                "selections": [
                                  (v2/*: any*/),
                                  {
                                    "kind": "InlineFragment",
                                    "selections": [
                                      (v17/*: any*/),
                                      (v9/*: any*/),
                                      (v3/*: any*/),
                                      (v4/*: any*/),
                                      (v7/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Profile",
                                        "kind": "LinkedField",
                                        "name": "profile",
                                        "plural": false,
                                        "selections": [
                                          (v7/*: any*/),
                                          (v3/*: any*/),
                                          (v4/*: any*/),
                                          (v60/*: any*/)
                                        ],
                                        "storageKey": null
                                      }
                                    ],
                                    "type": "Partner",
                                    "abstractKey": null
                                  },
                                  (v46/*: any*/),
                                  (v61/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v62/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Location",
                                "kind": "LinkedField",
                                "name": "location",
                                "plural": false,
                                "selections": [
                                  (v40/*: any*/),
                                  (v7/*: any*/)
                                ],
                                "storageKey": null
                              },
                              (v7/*: any*/),
                              (v2/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": "showsConnection(first:5)"
                  },
                  {
                    "alias": "shows",
                    "args": (v58/*: any*/),
                    "filters": null,
                    "handle": "connection",
                    "key": "Fair_shows",
                    "kind": "LinkedHandle",
                    "name": "showsConnection"
                  }
                ]
              }
            ],
            "type": "Fair",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v7/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v7/*: any*/),
                  (v60/*: any*/),
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bio",
                    "storageKey": null
                  },
                  (v17/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": (v64/*: any*/),
                "concreteType": "ArtworkConnection",
                "kind": "LinkedField",
                "name": "artworksConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtworkEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": (v29/*: any*/),
                    "storageKey": null
                  },
                  (v32/*: any*/),
                  (v47/*: any*/)
                ],
                "storageKey": "artworksConnection(first:10,sort:\"PARTNER_UPDATED_AT_DESC\")"
              },
              {
                "alias": "artworks",
                "args": (v64/*: any*/),
                "filters": (v52/*: any*/),
                "handle": "connection",
                "key": "Partner_artworks",
                "kind": "LinkedHandle",
                "name": "artworksConnection"
              },
              (v17/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cities",
                "storageKey": null
              },
              {
                "alias": "artists",
                "args": (v65/*: any*/),
                "concreteType": "ArtistPartnerConnection",
                "kind": "LinkedField",
                "name": "artistsConnection",
                "plural": false,
                "selections": [
                  (v59/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ArtistPartnerEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "initials",
                            "storageKey": null
                          },
                          (v9/*: any*/),
                          {
                            "alias": "is_followed",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "isFollowed",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "nationality",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "birthday",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "deathday",
                            "storageKey": null
                          },
                          (v55/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": (v49/*: any*/),
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v28/*: any*/),
                      (v7/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistsConnection(first:10,sort:\"SORTABLE_ID_ASC\")"
              },
              {
                "alias": "artists",
                "args": (v65/*: any*/),
                "filters": (v52/*: any*/),
                "handle": "connection",
                "key": "Partner_artists",
                "kind": "LinkedHandle",
                "name": "artistsConnection"
              },
              {
                "alias": "locations",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 0
                  }
                ],
                "concreteType": "LocationConnection",
                "kind": "LinkedField",
                "name": "locationsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "totalCount",
                    "storageKey": null
                  }
                ],
                "storageKey": "locationsConnection(first:0)"
              },
              {
                "alias": "recentShows",
                "args": [
                  (v63/*: any*/),
                  (v66/*: any*/)
                ],
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ShowEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Show",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v7/*: any*/),
                          (v67/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:10,status:\"CURRENT\")"
              },
              {
                "alias": "pastShows",
                "args": (v68/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v59/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ShowEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Show",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v67/*: any*/),
                          (v7/*: any*/),
                          (v17/*: any*/),
                          (v3/*: any*/),
                          (v23/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": [
                              (v53/*: any*/),
                              (v18/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v9/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v28/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:32,sort:\"END_AT_DESC\",status:\"CLOSED\")"
              },
              {
                "alias": "pastShows",
                "args": (v68/*: any*/),
                "filters": (v69/*: any*/),
                "handle": "connection",
                "key": "Partner_pastShows",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v70/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v59/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "ShowEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Show",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v67/*: any*/),
                          (v7/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v17/*: any*/),
                          (v23/*: any*/),
                          (v25/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": (v54/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": null,
                            "kind": "LinkedField",
                            "name": "partner",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": [
                                  (v17/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v46/*: any*/),
                              (v61/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v62/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v28/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:6,sort:\"END_AT_ASC\",status:\"CURRENT\")"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v70/*: any*/),
                "filters": (v69/*: any*/),
                "handle": "connection",
                "key": "Partner_currentAndUpcomingShows",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "PartnerCounts",
                "kind": "LinkedField",
                "name": "counts",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "eligibleArtworks",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "type": "Partner",
            "abstractKey": null
          },
          (v46/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "2a0f9b922b1e9699fd7da1c672bafb74",
    "metadata": {},
    "name": "VanityURLEntityQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b7dd905068325a3e2d5bb70c91008442';
export default node;
