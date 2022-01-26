/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 456b40163523e927fdd6ff3962e7fb0c */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type VanityURLEntityQueryVariables = {
    id: string;
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
) {
  vanityURLEntity(id: $id) {
    __typename
    ...VanityURLEntity_fairOrPartner
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

fragment ArtworkRailCard_artwork_hl5k2 on Artwork {
  id
  slug
  internalID
  href
  artistNames
  date
  image {
    resized(width: 155) {
      src
      srcSet
      width
      height
    }
    aspectRatio
  }
  sale {
    isAuction
    isClosed
    endAt
    id
  }
  saleMessage
  saleArtwork {
    counts {
      bidderPositions
    }
    currentBid {
      display
    }
    id
  }
  partner {
    name
    id
  }
  title
}

fragment FairArtworks_fair_ZORN9 on Fair {
  slug
  internalID
  fairArtworks: filterArtworksConnection(first: 30, aggregations: [ARTIST, ARTIST_NATIONALITY, COLOR, DIMENSION_RANGE, FOLLOWED_ARTISTS, LOCATION_CITY, MAJOR_PERIOD, MATERIALS_TERMS, MEDIUM, PARTNER, PRICE_RANGE], input: {sort: "-decayed_merch"}) {
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

fragment FairCollections_fair on Fair {
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

fragment FairEditorial_fair on Fair {
  internalID
  slug
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
    totalCount
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

fragment FairEmptyState_fair on Fair {
  isActive
  endAt
}

fragment FairExhibitorRail_show on Show {
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
  artworksConnection(first: 20) {
    edges {
      node {
        ...SmallArtworkRail_artworks
        id
      }
    }
  }
}

fragment FairExhibitors_fair on Fair {
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
        ...FairExhibitorRail_show
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

fragment FairFollowedArtistsRail_fair on Fair {
  internalID
  slug
  filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      node {
        ...SmallArtworkRail_artworks
        id
      }
    }
    id
  }
}

fragment FairHeader_fair on Fair {
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
  ...FairTiming_fair
}

fragment FairTiming_fair on Fair {
  exhibitionPeriod(format: SHORT)
  startAt
  endAt
}

fragment Fair_fair on Fair {
  internalID
  slug
  isActive
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
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
  followedArtistArtworks: filterArtworksConnection(first: 20, input: {includeArtworksByFollowedArtists: true}) {
    edges {
      __typename
    }
    id
  }
  ...FairHeader_fair
  ...FairEmptyState_fair
  ...FairEditorial_fair
  ...FairCollections_fair
  ...FairArtworks_fair_ZORN9
  ...FairExhibitors_fair
  ...FairFollowedArtistsRail_fair
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

fragment PartnerArtwork_partner_3XSKY6 on Partner {
  internalID
  slug
  artworks: filterArtworksConnection(first: 10, aggregations: [COLOR, DIMENSION_RANGE, ARTIST, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, MATERIALS_TERMS, ARTIST_NATIONALITY], input: {sort: "-partner_updated_at"}) {
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
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
    id
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
  exhibitionPeriod(format: SHORT)
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
        exhibitionPeriod(format: SHORT)
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
        exhibitionPeriod(format: SHORT)
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

fragment PartnerSubscriberBanner_partner on Partner {
  name
  hasFairPartnership
}

fragment Partner_partner on Partner {
  id
  internalID
  slug
  partnerType
  displayFullPartnerPage
  profile {
    id
    isFollowed
    internalID
  }
  ...PartnerArtwork_partner_3XSKY6
  ...PartnerOverview_partner
  ...PartnerShows_partner
  ...PartnerHeader_partner
  ...PartnerSubscriberBanner_partner
}

fragment SmallArtworkRail_artworks on Artwork {
  ...ArtworkRailCard_artwork_hl5k2
  internalID
  href
  slug
}

fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
  __isVanityURLEntityType: __typename
  __typename
  ... on Fair {
    slug
    ...Fair_fair
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
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "totalCount",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworks",
  "storageKey": null
},
v10 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v11 = [
  (v10/*: any*/),
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "includeArtworksByFollowedArtists": true
    }
  }
],
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v15 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v16 = {
  "alias": null,
  "args": [
    {
      "kind": "Literal",
      "name": "format",
      "value": "SHORT"
    }
  ],
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": "exhibitionPeriod(format:\"SHORT\")"
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v18 = {
  "kind": "Literal",
  "name": "first",
  "value": 30
},
v19 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "ARTIST",
      "ARTIST_NATIONALITY",
      "COLOR",
      "DIMENSION_RANGE",
      "FOLLOWED_ARTISTS",
      "LOCATION_CITY",
      "MAJOR_PERIOD",
      "MATERIALS_TERMS",
      "MEDIUM",
      "PARTNER",
      "PRICE_RANGE"
    ]
  },
  (v18/*: any*/),
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "sort": "-decayed_merch"
    }
  }
],
v20 = {
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
        (v13/*: any*/),
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
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v22 = {
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
        (v5/*: any*/),
        (v2/*: any*/)
      ],
      "storageKey": null
    },
    (v21/*: any*/)
  ],
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v23/*: any*/),
    (v24/*: any*/)
  ],
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startCursor",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v31 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v32 = {
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
v33 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v34 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v13/*: any*/),
    (v5/*: any*/)
  ],
  "storageKey": null
},
v35 = [
  (v5/*: any*/)
],
v36 = {
  "kind": "InlineFragment",
  "selections": (v35/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v37 = {
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
        (v26/*: any*/)
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
                (v14/*: any*/),
                {
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
                }
              ],
              "storageKey": null
            },
            (v6/*: any*/),
            (v27/*: any*/),
            (v28/*: any*/),
            (v4/*: any*/),
            (v29/*: any*/),
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Sale",
              "kind": "LinkedField",
              "name": "sale",
              "plural": false,
              "selections": [
                (v30/*: any*/),
                (v31/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "displayTimelyAt",
                  "storageKey": null
                },
                (v17/*: any*/),
                (v5/*: any*/)
              ],
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "concreteType": "SaleArtwork",
              "kind": "LinkedField",
              "name": "saleArtwork",
              "plural": false,
              "selections": [
                (v32/*: any*/),
                (v33/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "lotLabel",
                  "storageKey": null
                },
                (v5/*: any*/)
              ],
              "storageKey": null
            },
            (v34/*: any*/)
          ],
          "storageKey": null
        },
        (v36/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ArtworkConnectionInterface",
  "abstractKey": "__isArtworkConnectionInterface"
},
v38 = [
  "aggregations",
  "input"
],
v39 = [
  (v18/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v40 = [
  (v9/*: any*/)
],
v41 = [
  (v5/*: any*/),
  (v13/*: any*/)
],
v42 = [
  {
    "alias": null,
    "args": null,
    "concreteType": "Artwork",
    "kind": "LinkedField",
    "name": "node",
    "plural": false,
    "selections": [
      (v5/*: any*/),
      (v3/*: any*/),
      (v4/*: any*/),
      (v7/*: any*/),
      (v29/*: any*/),
      (v27/*: any*/),
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
                "name": "width",
                "value": 155
              }
            ],
            "concreteType": "ResizedImageUrl",
            "kind": "LinkedField",
            "name": "resized",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "src",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "srcSet",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "width",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "height",
                "storageKey": null
              }
            ],
            "storageKey": "resized(width:155)"
          },
          (v14/*: any*/)
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
          (v30/*: any*/),
          (v31/*: any*/),
          (v17/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v28/*: any*/),
      {
        "alias": null,
        "args": null,
        "concreteType": "SaleArtwork",
        "kind": "LinkedField",
        "name": "saleArtwork",
        "plural": false,
        "selections": [
          (v32/*: any*/),
          (v33/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      (v34/*: any*/),
      (v6/*: any*/)
    ],
    "storageKey": null
  }
],
v43 = [
  "sort"
],
v44 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v45 = [
  {
    "kind": "Literal",
    "name": "aggregations",
    "value": [
      "COLOR",
      "DIMENSION_RANGE",
      "ARTIST",
      "MAJOR_PERIOD",
      "MEDIUM",
      "PRICE_RANGE",
      "MATERIALS_TERMS",
      "ARTIST_NATIONALITY"
    ]
  },
  (v44/*: any*/),
  {
    "kind": "Literal",
    "name": "input",
    "value": {
      "sort": "-partner_updated_at"
    }
  }
],
v46 = [
  (v44/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "SORTABLE_ID_ASC"
  }
],
v47 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v24/*: any*/),
    (v26/*: any*/),
    (v23/*: any*/)
  ],
  "storageKey": null
},
v48 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v49 = [
  (v48/*: any*/)
],
v50 = {
  "kind": "Literal",
  "name": "status",
  "value": "CURRENT"
},
v51 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDisplayable",
  "storageKey": null
},
v52 = [
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
v53 = [
  "status",
  "sort"
],
v54 = [
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
  (v50/*: any*/)
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
            "args": null,
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
              (v4/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isActive",
                "storageKey": null
              },
              {
                "alias": "articles",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 5
                  },
                  {
                    "kind": "Literal",
                    "name": "inEditorialFeed",
                    "value": true
                  },
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
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
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
                  },
                  (v8/*: any*/)
                ],
                "storageKey": "articlesConnection(first:5,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")"
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
                  (v5/*: any*/),
                  (v3/*: any*/),
                  (v6/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "category",
                    "storageKey": null
                  },
                  {
                    "alias": "artworks",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "first",
                        "value": 3
                      }
                    ],
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
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v5/*: any*/)
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
                  (v9/*: any*/),
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
                "args": (v11/*: any*/),
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
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "about",
                "storageKey": null
              },
              (v12/*: any*/),
              (v13/*: any*/),
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
                  (v5/*: any*/)
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
                  (v14/*: any*/)
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
                  (v12/*: any*/),
                  {
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
                  (v5/*: any*/)
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
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "activationText",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "pressReleaseUrl",
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": "fairHours",
                "args": (v15/*: any*/),
                "kind": "ScalarField",
                "name": "hours",
                "storageKey": "hours(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairLinks",
                "args": (v15/*: any*/),
                "kind": "ScalarField",
                "name": "links",
                "storageKey": "links(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairTickets",
                "args": (v15/*: any*/),
                "kind": "ScalarField",
                "name": "tickets",
                "storageKey": "tickets(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairContact",
                "args": (v15/*: any*/),
                "kind": "ScalarField",
                "name": "contact",
                "storageKey": "contact(format:\"MARKDOWN\")"
              },
              (v16/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "startAt",
                "storageKey": null
              },
              (v17/*: any*/),
              {
                "alias": "fairArtworks",
                "args": (v19/*: any*/),
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "filterArtworksConnection",
                "plural": false,
                "selections": [
                  (v20/*: any*/),
                  (v22/*: any*/),
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
                  (v25/*: any*/),
                  (v5/*: any*/),
                  (v37/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(aggregations:[\"ARTIST\",\"ARTIST_NATIONALITY\",\"COLOR\",\"DIMENSION_RANGE\",\"FOLLOWED_ARTISTS\",\"LOCATION_CITY\",\"MAJOR_PERIOD\",\"MATERIALS_TERMS\",\"MEDIUM\",\"PARTNER\",\"PRICE_RANGE\"],first:30,input:{\"sort\":\"-decayed_merch\"})"
              },
              {
                "alias": "fairArtworks",
                "args": (v19/*: any*/),
                "filters": (v38/*: any*/),
                "handle": "connection",
                "key": "Fair_fairArtworks",
                "kind": "LinkedHandle",
                "name": "filterArtworksConnection"
              },
              {
                "alias": "exhibitors",
                "args": (v39/*: any*/),
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
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ShowCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": (v40/*: any*/),
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
                                "selections": (v41/*: any*/),
                                "type": "Partner",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": (v41/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              },
                              (v36/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v7/*: any*/),
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
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": [
                              (v10/*: any*/)
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
                                "selections": (v42/*: any*/),
                                "storageKey": null
                              }
                            ],
                            "storageKey": "artworksConnection(first:20)"
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v25/*: any*/)
                ],
                "storageKey": "showsConnection(first:30,sort:\"FEATURED_ASC\")"
              },
              {
                "alias": "exhibitors",
                "args": (v39/*: any*/),
                "filters": (v43/*: any*/),
                "handle": "connection",
                "key": "FairExhibitorsQuery_exhibitors",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              },
              {
                "alias": null,
                "args": (v11/*: any*/),
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
                    "selections": (v42/*: any*/),
                    "storageKey": null
                  },
                  (v5/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(first:20,input:{\"includeArtworksByFollowedArtists\":true})"
              }
            ],
            "type": "Fair",
            "abstractKey": null
          },
          {
            "kind": "InlineFragment",
            "selections": [
              (v5/*: any*/),
              (v4/*: any*/),
              (v3/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "partnerType",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "displayFullPartnerPage",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "Profile",
                "kind": "LinkedField",
                "name": "profile",
                "plural": false,
                "selections": [
                  (v5/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isFollowed",
                    "storageKey": null
                  },
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "bio",
                    "storageKey": null
                  },
                  (v13/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": (v45/*: any*/),
                "concreteType": "FilterArtworksConnection",
                "kind": "LinkedField",
                "name": "filterArtworksConnection",
                "plural": false,
                "selections": [
                  (v20/*: any*/),
                  (v22/*: any*/),
                  (v25/*: any*/),
                  (v5/*: any*/),
                  (v37/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"ARTIST\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"MATERIALS_TERMS\",\"ARTIST_NATIONALITY\"],first:10,input:{\"sort\":\"-partner_updated_at\"})"
              },
              {
                "alias": "artworks",
                "args": (v45/*: any*/),
                "filters": (v38/*: any*/),
                "handle": "connection",
                "key": "Partner_artworks",
                "kind": "LinkedHandle",
                "name": "filterArtworksConnection"
              },
              (v13/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cities",
                "storageKey": null
              },
              {
                "alias": "artists",
                "args": (v46/*: any*/),
                "concreteType": "ArtistPartnerConnection",
                "kind": "LinkedField",
                "name": "artistsConnection",
                "plural": false,
                "selections": [
                  (v47/*: any*/),
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
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "initials",
                            "storageKey": null
                          },
                          (v7/*: any*/),
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": (v49/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": (v40/*: any*/),
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v21/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistsConnection(first:10,sort:\"SORTABLE_ID_ASC\")"
              },
              {
                "alias": "artists",
                "args": (v46/*: any*/),
                "filters": (v43/*: any*/),
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
                  (v8/*: any*/)
                ],
                "storageKey": "locationsConnection(first:0)"
              },
              {
                "alias": "recentShows",
                "args": [
                  (v44/*: any*/),
                  (v50/*: any*/)
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
                          (v5/*: any*/),
                          (v51/*: any*/)
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
                "args": (v52/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v47/*: any*/),
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
                          (v51/*: any*/),
                          (v5/*: any*/),
                          (v13/*: any*/),
                          (v3/*: any*/),
                          (v16/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": [
                              (v48/*: any*/),
                              (v14/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:32,sort:\"END_AT_DESC\",status:\"CLOSED\")"
              },
              {
                "alias": "pastShows",
                "args": (v52/*: any*/),
                "filters": (v53/*: any*/),
                "handle": "connection",
                "key": "Partner_pastShows",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v54/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v47/*: any*/),
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
                          (v51/*: any*/),
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v13/*: any*/),
                          (v16/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": (v49/*: any*/),
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
                                  (v13/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v36/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": (v35/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": (v49/*: any*/),
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v21/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:6,sort:\"END_AT_ASC\",status:\"CURRENT\")"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v54/*: any*/),
                "filters": (v53/*: any*/),
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "hasFairPartnership",
                "storageKey": null
              }
            ],
            "type": "Partner",
            "abstractKey": null
          },
          (v36/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "456b40163523e927fdd6ff3962e7fb0c",
    "metadata": {},
    "name": "VanityURLEntityQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '345c641dc3f2ba52a22786a800cb6439';
export default node;
