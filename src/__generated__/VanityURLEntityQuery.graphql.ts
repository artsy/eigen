/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 70680471f6fa24cf5742a1fcf1f82622 */

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

fragment Fair2EmptyState_fair on Fair {
  isActive
  endAt
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
  ...Fair2EmptyState_fair
  ...Fair2Editorial_fair
  ...Fair2Collections_fair
  ...Fair2Artworks_fair
  ...Fair2Exhibitors_fair
  ...Fair2FollowedArtistsRail_fair
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

fragment VanityURLEntity_fairOrPartner on VanityURLEntityType {
  __isVanityURLEntityType: __typename
  __typename
  ... on Fair {
    slug
    ...Fair2_fair
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
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v17 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "exhibitionPeriod",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v20 = {
  "kind": "Literal",
  "name": "first",
  "value": 30
},
v21 = [
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
  (v20/*: any*/),
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
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v23 = [
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
  (v22/*: any*/)
],
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endCursor",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "hasNextPage",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v24/*: any*/),
    (v25/*: any*/)
  ],
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "startCursor",
  "storageKey": null
},
v28 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v30 = {
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
v31 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v32 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": (v31/*: any*/),
  "storageKey": null
},
v33 = [
  (v5/*: any*/)
],
v34 = {
  "kind": "InlineFragment",
  "selections": (v33/*: any*/),
  "type": "Node",
  "abstractKey": "__isNode"
},
v35 = {
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
        (v27/*: any*/)
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
                (v16/*: any*/),
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
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "date",
              "storageKey": null
            },
            (v13/*: any*/),
            (v4/*: any*/),
            (v11/*: any*/),
            (v7/*: any*/),
            {
              "alias": null,
              "args": null,
              "concreteType": "Sale",
              "kind": "LinkedField",
              "name": "sale",
              "plural": false,
              "selections": [
                (v28/*: any*/),
                (v29/*: any*/),
                {
                  "alias": null,
                  "args": null,
                  "kind": "ScalarField",
                  "name": "displayTimelyAt",
                  "storageKey": null
                },
                (v19/*: any*/),
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
                (v30/*: any*/),
                (v32/*: any*/),
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
            {
              "alias": null,
              "args": null,
              "concreteType": "Partner",
              "kind": "LinkedField",
              "name": "partner",
              "plural": false,
              "selections": [
                (v15/*: any*/),
                (v5/*: any*/)
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        },
        (v34/*: any*/)
      ],
      "storageKey": null
    }
  ],
  "type": "ArtworkConnectionInterface",
  "abstractKey": "__isArtworkConnectionInterface"
},
v36 = [
  (v20/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v37 = [
  (v9/*: any*/)
],
v38 = [
  (v5/*: any*/),
  (v15/*: any*/)
],
v39 = [
  "sort"
],
v40 = {
  "kind": "Literal",
  "name": "first",
  "value": 10
},
v41 = [
  (v40/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "PARTNER_UPDATED_AT_DESC"
  }
],
v42 = [
  (v40/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "SORTABLE_ID_ASC"
  }
],
v43 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    (v25/*: any*/),
    (v27/*: any*/),
    (v24/*: any*/)
  ],
  "storageKey": null
},
v44 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "url",
  "storageKey": null
},
v45 = [
  (v44/*: any*/)
],
v46 = {
  "kind": "Literal",
  "name": "status",
  "value": "CURRENT"
},
v47 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isDisplayable",
  "storageKey": null
},
v48 = [
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
v49 = [
  "status",
  "sort"
],
v50 = [
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
  (v46/*: any*/)
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
                "args": [
                  (v10/*: any*/),
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
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v7/*: any*/),
                          (v11/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "image",
                            "plural": false,
                            "selections": [
                              (v12/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v13/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  },
                  (v5/*: any*/)
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
              (v14/*: any*/),
              (v15/*: any*/),
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
                  (v16/*: any*/)
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
                  (v14/*: any*/),
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
                "args": (v17/*: any*/),
                "kind": "ScalarField",
                "name": "hours",
                "storageKey": "hours(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairLinks",
                "args": (v17/*: any*/),
                "kind": "ScalarField",
                "name": "links",
                "storageKey": "links(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairTickets",
                "args": (v17/*: any*/),
                "kind": "ScalarField",
                "name": "tickets",
                "storageKey": "tickets(format:\"MARKDOWN\")"
              },
              {
                "alias": "fairContact",
                "args": (v17/*: any*/),
                "kind": "ScalarField",
                "name": "contact",
                "storageKey": "contact(format:\"MARKDOWN\")"
              },
              (v18/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "startAt",
                "storageKey": null
              },
              (v19/*: any*/),
              {
                "alias": "fairArtworks",
                "args": (v21/*: any*/),
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
                          (v15/*: any*/),
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
                    "selections": (v23/*: any*/),
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
                  (v26/*: any*/),
                  (v5/*: any*/),
                  (v35/*: any*/)
                ],
                "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],dimensionRange:\"*-*\",first:30,medium:\"*\",sort:\"-decayed_merch\")"
              },
              {
                "alias": "fairArtworks",
                "args": (v21/*: any*/),
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
                "args": (v36/*: any*/),
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
                            "selections": (v37/*: any*/),
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
                                "selections": (v38/*: any*/),
                                "type": "Partner",
                                "abstractKey": null
                              },
                              {
                                "kind": "InlineFragment",
                                "selections": (v38/*: any*/),
                                "type": "ExternalPartner",
                                "abstractKey": null
                              },
                              (v34/*: any*/)
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
                            "alias": "artworks",
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
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Artwork",
                                    "kind": "LinkedField",
                                    "name": "node",
                                    "plural": false,
                                    "selections": [
                                      (v7/*: any*/),
                                      (v11/*: any*/),
                                      (v5/*: any*/),
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "Image",
                                        "kind": "LinkedField",
                                        "name": "image",
                                        "plural": false,
                                        "selections": [
                                          (v12/*: any*/),
                                          (v16/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v13/*: any*/),
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
                                            "selections": (v31/*: any*/),
                                            "storageKey": null
                                          },
                                          {
                                            "alias": null,
                                            "args": null,
                                            "concreteType": "SaleArtworkHighestBid",
                                            "kind": "LinkedField",
                                            "name": "highestBid",
                                            "plural": false,
                                            "selections": (v31/*: any*/),
                                            "storageKey": null
                                          },
                                          (v32/*: any*/),
                                          (v30/*: any*/),
                                          (v5/*: any*/)
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
                                          (v29/*: any*/),
                                          (v28/*: any*/),
                                          (v19/*: any*/),
                                          (v5/*: any*/)
                                        ],
                                        "storageKey": null
                                      },
                                      (v6/*: any*/),
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
                      (v22/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v26/*: any*/)
                ],
                "storageKey": "showsConnection(first:30,sort:\"FEATURED_ASC\")"
              },
              {
                "alias": "exhibitors",
                "args": (v36/*: any*/),
                "filters": (v39/*: any*/),
                "handle": "connection",
                "key": "Fair2ExhibitorsQuery_exhibitors",
                "kind": "LinkedHandle",
                "name": "showsConnection"
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
                  (v15/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "artworks",
                "args": (v41/*: any*/),
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
                    "selections": (v23/*: any*/),
                    "storageKey": null
                  },
                  (v26/*: any*/),
                  (v35/*: any*/)
                ],
                "storageKey": "artworksConnection(first:10,sort:\"PARTNER_UPDATED_AT_DESC\")"
              },
              {
                "alias": "artworks",
                "args": (v41/*: any*/),
                "filters": (v39/*: any*/),
                "handle": "connection",
                "key": "Partner_artworks",
                "kind": "LinkedHandle",
                "name": "artworksConnection"
              },
              (v15/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "cities",
                "storageKey": null
              },
              {
                "alias": "artists",
                "args": (v42/*: any*/),
                "concreteType": "ArtistPartnerConnection",
                "kind": "LinkedField",
                "name": "artistsConnection",
                "plural": false,
                "selections": [
                  (v43/*: any*/),
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
                          (v15/*: any*/),
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
                            "selections": (v45/*: any*/),
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "ArtistCounts",
                            "kind": "LinkedField",
                            "name": "counts",
                            "plural": false,
                            "selections": (v37/*: any*/),
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v22/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "artistsConnection(first:10,sort:\"SORTABLE_ID_ASC\")"
              },
              {
                "alias": "artists",
                "args": (v42/*: any*/),
                "filters": (v39/*: any*/),
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
                  (v40/*: any*/),
                  (v46/*: any*/)
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
                          (v47/*: any*/)
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
                "args": (v48/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v43/*: any*/),
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
                          (v47/*: any*/),
                          (v5/*: any*/),
                          (v15/*: any*/),
                          (v3/*: any*/),
                          (v18/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "coverImage",
                            "plural": false,
                            "selections": [
                              (v44/*: any*/),
                              (v16/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v7/*: any*/),
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v22/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:32,sort:\"END_AT_DESC\",status:\"CLOSED\")"
              },
              {
                "alias": "pastShows",
                "args": (v48/*: any*/),
                "filters": (v49/*: any*/),
                "handle": "connection",
                "key": "Partner_pastShows",
                "kind": "LinkedHandle",
                "name": "showsConnection"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v50/*: any*/),
                "concreteType": "ShowConnection",
                "kind": "LinkedField",
                "name": "showsConnection",
                "plural": false,
                "selections": [
                  (v43/*: any*/),
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
                          (v47/*: any*/),
                          (v5/*: any*/),
                          (v4/*: any*/),
                          (v3/*: any*/),
                          (v15/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": (v45/*: any*/),
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
                                  (v15/*: any*/)
                                ],
                                "type": "Partner",
                                "abstractKey": null
                              },
                              (v34/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "selections": (v33/*: any*/),
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
                            "selections": (v45/*: any*/),
                            "storageKey": null
                          },
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v22/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "showsConnection(first:6,sort:\"END_AT_ASC\",status:\"CURRENT\")"
              },
              {
                "alias": "currentAndUpcomingShows",
                "args": (v50/*: any*/),
                "filters": (v49/*: any*/),
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
          (v34/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "70680471f6fa24cf5742a1fcf1f82622",
    "metadata": {},
    "name": "VanityURLEntityQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '345c641dc3f2ba52a22786a800cb6439';
export default node;
