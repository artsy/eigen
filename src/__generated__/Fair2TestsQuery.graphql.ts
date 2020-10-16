/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 40efdd665182cc0a94a01848f79dca8f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Fair2TestsQueryVariables = {
    fairID: string;
};
export type Fair2TestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
    } | null;
};
export type Fair2TestsQuery = {
    readonly response: Fair2TestsQueryResponse;
    readonly variables: Fair2TestsQueryVariables;
};



/*
query Fair2TestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...Fair2_fair
    id
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
  fairArtworksForAggregation: filterArtworksConnection(first: 0, aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST]) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    id
  }
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
  marketingCollections(size: 4) {
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
  marketingCollections(size: 4) {
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "fairID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "fairID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
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
  "name": "__typename",
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
  "name": "artworks",
  "storageKey": null
},
v9 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "imageURL",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleMessage",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "summary",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "aspectRatio",
  "storageKey": null
},
v16 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v18 = {
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
v19 = {
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
        (v14/*: any*/),
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
v20 = {
  "kind": "Literal",
  "name": "first",
  "value": 30
},
v21 = [
  (v18/*: any*/),
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
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "PageInfo",
  "kind": "LinkedField",
  "name": "pageInfo",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "endCursor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "hasNextPage",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v26 = {
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
v27 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v28 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": (v27/*: any*/),
  "storageKey": null
},
v29 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
},
v30 = [
  (v20/*: any*/),
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v31 = [
  (v5/*: any*/),
  (v14/*: any*/)
],
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Fair"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v34 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v35 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v39 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v40 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v41 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v43 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCounts"
},
v44 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v45 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "PageInfo"
},
v46 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v47 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksConnection"
},
v48 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ArtworksAggregationResults"
},
v49 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "AggregationCount"
},
v50 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v51 = {
  "enumValues": [
    "ARTIST",
    "COLOR",
    "DIMENSION_RANGE",
    "FOLLOWED_ARTISTS",
    "GALLERY",
    "INSTITUTION",
    "MAJOR_PERIOD",
    "MEDIUM",
    "MERCHANDISABLE_ARTISTS",
    "PARTNER_CITY",
    "PERIOD",
    "PRICE_RANGE",
    "TOTAL"
  ],
  "nullable": true,
  "plural": false,
  "type": "ArtworkAggregation"
},
v52 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "FilterArtworksEdge"
},
v53 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "Fair2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "Fair2_fair"
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
    "name": "Fair2TestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
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
                  (v4/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Article",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v2/*: any*/),
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
                "value": 4
              }
            ],
            "concreteType": "MarketingCollection",
            "kind": "LinkedField",
            "name": "marketingCollections",
            "plural": true,
            "selections": [
              (v4/*: any*/),
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
            "storageKey": "marketingCollections(size:4)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "FairCounts",
            "kind": "LinkedField",
            "name": "counts",
            "plural": false,
            "selections": [
              (v8/*: any*/),
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
              (v9/*: any*/),
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
                  (v4/*: any*/),
                  {
                    "alias": "artwork",
                    "args": null,
                    "concreteType": "Artwork",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v2/*: any*/),
                      (v3/*: any*/),
                      (v7/*: any*/),
                      (v10/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Image",
                        "kind": "LinkedField",
                        "name": "image",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v12/*: any*/)
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
          (v13/*: any*/),
          (v14/*: any*/),
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
              (v15/*: any*/)
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
              (v13/*: any*/),
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
            "args": (v16/*: any*/),
            "kind": "ScalarField",
            "name": "hours",
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairLinks",
            "args": (v16/*: any*/),
            "kind": "ScalarField",
            "name": "links",
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairTickets",
            "args": (v16/*: any*/),
            "kind": "ScalarField",
            "name": "tickets",
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          {
            "alias": "fairContact",
            "args": (v16/*: any*/),
            "kind": "ScalarField",
            "name": "contact",
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "exhibitionPeriod",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "startAt",
            "storageKey": null
          },
          (v17/*: any*/),
          {
            "alias": "fairArtworksForAggregation",
            "args": [
              (v18/*: any*/),
              {
                "kind": "Literal",
                "name": "first",
                "value": 0
              }
            ],
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              (v19/*: any*/),
              (v5/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],first:0)"
          },
          {
            "alias": "fairArtworks",
            "args": (v21/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              (v19/*: any*/),
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
                      (v5/*: any*/),
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/)
                ],
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
              (v23/*: any*/),
              (v5/*: any*/),
              {
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "startCursor",
                        "storageKey": null
                      }
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
                      (v4/*: any*/),
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
                              (v15/*: any*/),
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
                          (v12/*: any*/),
                          (v2/*: any*/),
                          (v10/*: any*/),
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v24/*: any*/),
                              (v25/*: any*/),
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
                              (v26/*: any*/),
                              (v28/*: any*/),
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
                              (v14/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v29/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
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
            "args": (v30/*: any*/),
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
                        "selections": [
                          (v8/*: any*/)
                        ],
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
                          (v4/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": (v31/*: any*/),
                            "type": "Partner",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": (v31/*: any*/),
                            "type": "ExternalPartner",
                            "abstractKey": null
                          },
                          (v29/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/),
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
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v5/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": "artworks",
                        "args": [
                          (v9/*: any*/)
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
                                  (v10/*: any*/),
                                  (v5/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "kind": "LinkedField",
                                    "name": "image",
                                    "plural": false,
                                    "selections": [
                                      (v11/*: any*/),
                                      (v15/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v12/*: any*/),
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
                                        "selections": (v27/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkHighestBid",
                                        "kind": "LinkedField",
                                        "name": "highestBid",
                                        "plural": false,
                                        "selections": (v27/*: any*/),
                                        "storageKey": null
                                      },
                                      (v28/*: any*/),
                                      (v26/*: any*/),
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
                                      (v25/*: any*/),
                                      (v24/*: any*/),
                                      (v17/*: any*/),
                                      (v5/*: any*/)
                                    ],
                                    "storageKey": null
                                  },
                                  (v6/*: any*/),
                                  (v2/*: any*/),
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
                      (v4/*: any*/)
                    ],
                    "storageKey": null
                  },
                  (v22/*: any*/)
                ],
                "storageKey": null
              },
              (v23/*: any*/)
            ],
            "storageKey": "showsConnection(first:30,sort:\"FEATURED_ASC\")"
          },
          {
            "alias": "exhibitors",
            "args": (v30/*: any*/),
            "filters": [
              "sort"
            ],
            "handle": "connection",
            "key": "Fair2ExhibitorsQuery_exhibitors",
            "kind": "LinkedHandle",
            "name": "showsConnection"
          },
          (v5/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "40efdd665182cc0a94a01848f79dca8f",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": (v32/*: any*/),
        "fair.about": (v33/*: any*/),
        "fair.articles": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArticleConnection"
        },
        "fair.articles.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArticleEdge"
        },
        "fair.articles.edges.__typename": (v34/*: any*/),
        "fair.articles.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Article"
        },
        "fair.articles.edges.node.href": (v33/*: any*/),
        "fair.articles.edges.node.id": (v35/*: any*/),
        "fair.articles.edges.node.internalID": (v35/*: any*/),
        "fair.articles.edges.node.publishedAt": (v33/*: any*/),
        "fair.articles.edges.node.slug": (v33/*: any*/),
        "fair.articles.edges.node.thumbnailImage": (v36/*: any*/),
        "fair.articles.edges.node.thumbnailImage.src": (v33/*: any*/),
        "fair.articles.edges.node.title": (v33/*: any*/),
        "fair.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FairCounts"
        },
        "fair.counts.artworks": (v37/*: any*/),
        "fair.counts.partnerShows": (v37/*: any*/),
        "fair.endAt": (v33/*: any*/),
        "fair.exhibitionPeriod": (v33/*: any*/),
        "fair.exhibitors": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowConnection"
        },
        "fair.exhibitors.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ShowEdge"
        },
        "fair.exhibitors.edges.cursor": (v34/*: any*/),
        "fair.exhibitors.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Show"
        },
        "fair.exhibitors.edges.node.__typename": (v34/*: any*/),
        "fair.exhibitors.edges.node.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtworkConnection"
        },
        "fair.exhibitors.edges.node.artworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdge"
        },
        "fair.exhibitors.edges.node.artworks.edges.node": (v38/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.artistNames": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.href": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.image": (v36/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.image.aspectRatio": (v39/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.image.imageURL": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.internalID": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.sale": (v40/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.sale.endAt": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.sale.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.sale.isAuction": (v41/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.sale.isClosed": (v41/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork": (v42/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.counts": (v43/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.counts.bidderPositions": (v37/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.currentBid": (v44/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.currentBid.display": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.highestBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkHighestBid"
        },
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.highestBid.display": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.openingBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkOpeningBid"
        },
        "fair.exhibitors.edges.node.artworks.edges.node.saleArtwork.openingBid.display": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.saleMessage": (v33/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.slug": (v35/*: any*/),
        "fair.exhibitors.edges.node.artworks.edges.node.title": (v33/*: any*/),
        "fair.exhibitors.edges.node.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ShowCounts"
        },
        "fair.exhibitors.edges.node.counts.artworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "fair.exhibitors.edges.node.fair": (v32/*: any*/),
        "fair.exhibitors.edges.node.fair.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.fair.internalID": (v35/*: any*/),
        "fair.exhibitors.edges.node.fair.slug": (v35/*: any*/),
        "fair.exhibitors.edges.node.href": (v33/*: any*/),
        "fair.exhibitors.edges.node.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.internalID": (v35/*: any*/),
        "fair.exhibitors.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "PartnerTypes"
        },
        "fair.exhibitors.edges.node.partner.__isNode": (v34/*: any*/),
        "fair.exhibitors.edges.node.partner.__typename": (v34/*: any*/),
        "fair.exhibitors.edges.node.partner.id": (v35/*: any*/),
        "fair.exhibitors.edges.node.partner.name": (v33/*: any*/),
        "fair.exhibitors.edges.node.slug": (v35/*: any*/),
        "fair.exhibitors.pageInfo": (v45/*: any*/),
        "fair.exhibitors.pageInfo.endCursor": (v33/*: any*/),
        "fair.exhibitors.pageInfo.hasNextPage": (v46/*: any*/),
        "fair.fairArtworks": (v47/*: any*/),
        "fair.fairArtworks.__isArtworkConnectionInterface": (v34/*: any*/),
        "fair.fairArtworks.aggregations": (v48/*: any*/),
        "fair.fairArtworks.aggregations.counts": (v49/*: any*/),
        "fair.fairArtworks.aggregations.counts.count": (v50/*: any*/),
        "fair.fairArtworks.aggregations.counts.name": (v34/*: any*/),
        "fair.fairArtworks.aggregations.counts.value": (v34/*: any*/),
        "fair.fairArtworks.aggregations.slice": (v51/*: any*/),
        "fair.fairArtworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "fair.fairArtworks.counts.followedArtists": (v37/*: any*/),
        "fair.fairArtworks.counts.total": (v37/*: any*/),
        "fair.fairArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "fair.fairArtworks.edges.__isNode": (v34/*: any*/),
        "fair.fairArtworks.edges.__typename": (v34/*: any*/),
        "fair.fairArtworks.edges.cursor": (v34/*: any*/),
        "fair.fairArtworks.edges.id": (v35/*: any*/),
        "fair.fairArtworks.edges.node": (v38/*: any*/),
        "fair.fairArtworks.edges.node.__typename": (v34/*: any*/),
        "fair.fairArtworks.edges.node.artistNames": (v33/*: any*/),
        "fair.fairArtworks.edges.node.date": (v33/*: any*/),
        "fair.fairArtworks.edges.node.href": (v33/*: any*/),
        "fair.fairArtworks.edges.node.id": (v35/*: any*/),
        "fair.fairArtworks.edges.node.image": (v36/*: any*/),
        "fair.fairArtworks.edges.node.image.aspectRatio": (v39/*: any*/),
        "fair.fairArtworks.edges.node.image.url": (v33/*: any*/),
        "fair.fairArtworks.edges.node.internalID": (v35/*: any*/),
        "fair.fairArtworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "fair.fairArtworks.edges.node.partner.id": (v35/*: any*/),
        "fair.fairArtworks.edges.node.partner.name": (v33/*: any*/),
        "fair.fairArtworks.edges.node.sale": (v40/*: any*/),
        "fair.fairArtworks.edges.node.sale.displayTimelyAt": (v33/*: any*/),
        "fair.fairArtworks.edges.node.sale.endAt": (v33/*: any*/),
        "fair.fairArtworks.edges.node.sale.id": (v35/*: any*/),
        "fair.fairArtworks.edges.node.sale.isAuction": (v41/*: any*/),
        "fair.fairArtworks.edges.node.sale.isClosed": (v41/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork": (v42/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.counts": (v43/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.counts.bidderPositions": (v37/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.currentBid": (v44/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.currentBid.display": (v33/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.id": (v35/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.lotLabel": (v33/*: any*/),
        "fair.fairArtworks.edges.node.saleMessage": (v33/*: any*/),
        "fair.fairArtworks.edges.node.slug": (v35/*: any*/),
        "fair.fairArtworks.edges.node.title": (v33/*: any*/),
        "fair.fairArtworks.id": (v35/*: any*/),
        "fair.fairArtworks.pageInfo": (v45/*: any*/),
        "fair.fairArtworks.pageInfo.endCursor": (v33/*: any*/),
        "fair.fairArtworks.pageInfo.hasNextPage": (v46/*: any*/),
        "fair.fairArtworks.pageInfo.startCursor": (v33/*: any*/),
        "fair.fairArtworksForAggregation": (v47/*: any*/),
        "fair.fairArtworksForAggregation.aggregations": (v48/*: any*/),
        "fair.fairArtworksForAggregation.aggregations.counts": (v49/*: any*/),
        "fair.fairArtworksForAggregation.aggregations.counts.count": (v50/*: any*/),
        "fair.fairArtworksForAggregation.aggregations.counts.name": (v34/*: any*/),
        "fair.fairArtworksForAggregation.aggregations.counts.value": (v34/*: any*/),
        "fair.fairArtworksForAggregation.aggregations.slice": (v51/*: any*/),
        "fair.fairArtworksForAggregation.id": (v35/*: any*/),
        "fair.fairContact": (v33/*: any*/),
        "fair.fairHours": (v33/*: any*/),
        "fair.fairLinks": (v33/*: any*/),
        "fair.fairTickets": (v33/*: any*/),
        "fair.followedArtistArtworks": (v47/*: any*/),
        "fair.followedArtistArtworks.edges": (v52/*: any*/),
        "fair.followedArtistArtworks.edges.__typename": (v34/*: any*/),
        "fair.followedArtistArtworks.edges.artwork": (v38/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.artistNames": (v33/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.href": (v33/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.id": (v35/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.image": (v36/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.image.imageURL": (v33/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.internalID": (v35/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.saleMessage": (v33/*: any*/),
        "fair.followedArtistArtworks.edges.artwork.slug": (v35/*: any*/),
        "fair.followedArtistArtworks.id": (v35/*: any*/),
        "fair.id": (v35/*: any*/),
        "fair.image": (v36/*: any*/),
        "fair.image.aspectRatio": (v39/*: any*/),
        "fair.image.imageUrl": (v33/*: any*/),
        "fair.internalID": (v35/*: any*/),
        "fair.isActive": (v41/*: any*/),
        "fair.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Location"
        },
        "fair.location.coordinates": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "LatLng"
        },
        "fair.location.coordinates.lat": (v53/*: any*/),
        "fair.location.coordinates.lng": (v53/*: any*/),
        "fair.location.id": (v35/*: any*/),
        "fair.location.summary": (v33/*: any*/),
        "fair.marketingCollections": {
          "enumValues": null,
          "nullable": false,
          "plural": true,
          "type": "MarketingCollection"
        },
        "fair.marketingCollections.__typename": (v34/*: any*/),
        "fair.marketingCollections.artworks": (v47/*: any*/),
        "fair.marketingCollections.artworks.edges": (v52/*: any*/),
        "fair.marketingCollections.artworks.edges.node": (v38/*: any*/),
        "fair.marketingCollections.artworks.edges.node.id": (v35/*: any*/),
        "fair.marketingCollections.artworks.edges.node.image": (v36/*: any*/),
        "fair.marketingCollections.artworks.edges.node.image.url": (v33/*: any*/),
        "fair.marketingCollections.artworks.id": (v35/*: any*/),
        "fair.marketingCollections.category": (v34/*: any*/),
        "fair.marketingCollections.id": (v35/*: any*/),
        "fair.marketingCollections.slug": (v34/*: any*/),
        "fair.marketingCollections.title": (v34/*: any*/),
        "fair.name": (v33/*: any*/),
        "fair.profile": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Profile"
        },
        "fair.profile.icon": (v36/*: any*/),
        "fair.profile.icon.imageUrl": (v33/*: any*/),
        "fair.profile.id": (v35/*: any*/),
        "fair.slug": (v35/*: any*/),
        "fair.sponsoredContent": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FairSponsoredContent"
        },
        "fair.sponsoredContent.activationText": (v33/*: any*/),
        "fair.sponsoredContent.pressReleaseUrl": (v33/*: any*/),
        "fair.startAt": (v33/*: any*/),
        "fair.summary": (v33/*: any*/),
        "fair.tagline": (v33/*: any*/),
        "fair.ticketsLink": (v33/*: any*/)
      }
    },
    "name": "Fair2TestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ba43d699327face9af7a6d20f6cb38d6';
export default node;
