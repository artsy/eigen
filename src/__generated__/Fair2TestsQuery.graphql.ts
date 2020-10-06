/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0ae67ed58f477527546b20593316e62d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "ARTIST" | "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
export type Fair2TestsQueryVariables = {
    fairID: string;
};
export type Fair2TestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"Fair2_fair">;
    } | null;
};
export type Fair2TestsQueryRawResponse = {
    readonly fair: ({
        readonly internalID: string;
        readonly slug: string;
        readonly articles: ({
            readonly edges: ReadonlyArray<({
                readonly __typename: string;
                readonly node: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string | null;
                    readonly title: string | null;
                    readonly href: string | null;
                    readonly publishedAt: string | null;
                    readonly thumbnailImage: ({
                        readonly src: string | null;
                    }) | null;
                }) | null;
            }) | null> | null;
        }) | null;
        readonly marketingCollections: ReadonlyArray<({
            readonly __typename: string;
            readonly id: string;
            readonly internalID: string;
            readonly slug: string;
            readonly title: string;
            readonly category: string;
            readonly artworks: ({
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly image: ({
                            readonly url: string | null;
                        }) | null;
                        readonly id: string;
                    }) | null;
                }) | null> | null;
                readonly id: string;
            }) | null;
        }) | null>;
        readonly counts: ({
            readonly artworks: number | null;
            readonly partnerShows: number | null;
        }) | null;
        readonly followedArtistArtworks: ({
            readonly edges: ReadonlyArray<({
                readonly __typename: string;
                readonly artwork: ({
                    readonly id: string;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly artistNames: string | null;
                    readonly image: ({
                        readonly imageURL: string | null;
                    }) | null;
                    readonly saleMessage: string | null;
                }) | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly about: string | null;
        readonly summary: string | null;
        readonly name: string | null;
        readonly profile: ({
            readonly icon: ({
                readonly imageUrl: string | null;
            }) | null;
            readonly id: string;
        }) | null;
        readonly image: ({
            readonly imageUrl: string | null;
            readonly aspectRatio: number;
        }) | null;
        readonly tagline: string | null;
        readonly location: ({
            readonly summary: string | null;
            readonly id: string;
        }) | null;
        readonly ticketsLink: string | null;
        readonly fairHours: string | null;
        readonly fairLinks: string | null;
        readonly fairTickets: string | null;
        readonly fairContact: string | null;
        readonly exhibitionPeriod: string | null;
        readonly startAt: string | null;
        readonly endAt: string | null;
        readonly fairArtworks: ({
            readonly aggregations: ReadonlyArray<({
                readonly slice: ArtworkAggregation | null;
                readonly counts: ReadonlyArray<({
                    readonly count: number;
                    readonly name: string;
                    readonly value: string;
                }) | null> | null;
            }) | null> | null;
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly __typename: "Artwork";
                    readonly slug?: string;
                    readonly image?: ({
                        readonly aspectRatio: number;
                        readonly url: string | null;
                    }) | null;
                    readonly title?: string | null;
                    readonly date?: string | null;
                    readonly saleMessage?: string | null;
                    readonly internalID?: string;
                    readonly artistNames?: string | null;
                    readonly href?: string | null;
                    readonly sale?: ({
                        readonly isAuction: boolean | null;
                        readonly isClosed: boolean | null;
                        readonly displayTimelyAt: string | null;
                        readonly endAt: string | null;
                        readonly id: string;
                    }) | null;
                    readonly saleArtwork?: ({
                        readonly counts: ({
                            readonly bidderPositions: number | null;
                        }) | null;
                        readonly currentBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly lotLabel: string | null;
                        readonly id: string;
                    }) | null;
                    readonly partner?: ({
                        readonly name: string | null;
                        readonly id: string;
                    }) | null;
                }) | null;
                readonly cursor: string;
                readonly __typename?: string;
                readonly __isNode?: string;
                readonly id?: string;
            }) | null> | null;
            readonly counts: ({
                readonly total: number | null;
                readonly followedArtists: number | null;
            }) | null;
            readonly pageInfo: {
                readonly endCursor: string | null;
                readonly hasNextPage: boolean;
                readonly startCursor?: string | null;
            };
            readonly id: string;
            readonly __isArtworkConnectionInterface: "FilterArtworksConnection";
        }) | null;
        readonly exhibitors: ({
            readonly edges: ReadonlyArray<({
                readonly node: ({
                    readonly id: string;
                    readonly counts: ({
                        readonly artworks: number | null;
                    }) | null;
                    readonly partner: ({
                        readonly __typename: "Partner";
                        readonly __isNode: "Partner";
                        readonly id: string;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly __isNode: "ExternalPartner";
                        readonly id: string;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string;
                        readonly __isNode: string;
                        readonly id: string;
                    }) | null;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly href: string | null;
                    readonly fair: ({
                        readonly internalID: string;
                        readonly slug: string;
                        readonly id: string;
                    }) | null;
                    readonly artworks: ({
                        readonly edges: ReadonlyArray<({
                            readonly node: ({
                                readonly href: string | null;
                                readonly artistNames: string | null;
                                readonly id: string;
                                readonly image: ({
                                    readonly imageURL: string | null;
                                    readonly aspectRatio: number;
                                }) | null;
                                readonly saleMessage: string | null;
                                readonly saleArtwork: ({
                                    readonly openingBid: ({
                                        readonly display: string | null;
                                    }) | null;
                                    readonly highestBid: ({
                                        readonly display: string | null;
                                    }) | null;
                                    readonly currentBid: ({
                                        readonly display: string | null;
                                    }) | null;
                                    readonly counts: ({
                                        readonly bidderPositions: number | null;
                                    }) | null;
                                    readonly id: string;
                                }) | null;
                                readonly sale: ({
                                    readonly isClosed: boolean | null;
                                    readonly isAuction: boolean | null;
                                    readonly endAt: string | null;
                                    readonly id: string;
                                }) | null;
                                readonly title: string | null;
                                readonly internalID: string;
                                readonly slug: string;
                            }) | null;
                        }) | null> | null;
                    }) | null;
                    readonly __typename: "Show";
                }) | null;
                readonly cursor: string;
            }) | null> | null;
            readonly pageInfo: {
                readonly endCursor: string | null;
                readonly hasNextPage: boolean;
            };
        }) | null;
        readonly id: string;
    }) | null;
};
export type Fair2TestsQuery = {
    readonly response: Fair2TestsQueryResponse;
    readonly variables: Fair2TestsQueryVariables;
    readonly rawResponse: Fair2TestsQueryRawResponse;
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
  fairArtworks: filterArtworksConnection(first: 20, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS]) {
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
    internalID
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
        publishedAt(format: "MMM Do, YY")
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
  exhibitors: showsConnection(first: 15, sort: FEATURED_ASC) {
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

fragment Fair2FollowedArtists_fair on Fair {
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
    id
  }
  ticketsLink
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
  ...Fair2FollowedArtists_fair
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
v18 = [
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
      "FOLLOWED_ARTISTS"
    ]
  },
  {
    "kind": "Literal",
    "name": "dimensionRange",
    "value": "*-*"
  },
  (v9/*: any*/),
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
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cursor",
  "storageKey": null
},
v20 = {
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
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isAuction",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isClosed",
  "storageKey": null
},
v23 = {
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
v24 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v25 = {
  "alias": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "kind": "LinkedField",
  "name": "currentBid",
  "plural": false,
  "selections": (v24/*: any*/),
  "storageKey": null
},
v26 = {
  "kind": "InlineFragment",
  "selections": [
    (v5/*: any*/)
  ],
  "type": "Node",
  "abstractKey": "__isNode"
},
v27 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 15
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "FEATURED_ASC"
  }
],
v28 = [
  (v5/*: any*/),
  (v14/*: any*/)
];
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
                            "value": "MMM Do, YY"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "publishedAt",
                        "storageKey": "publishedAt(format:\"MMM Do, YY\")"
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
              (v2/*: any*/),
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
            "alias": "fairArtworks",
            "args": (v18/*: any*/),
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
                  (v19/*: any*/)
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
              (v20/*: any*/),
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
                              (v21/*: any*/),
                              (v22/*: any*/),
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
                              (v23/*: any*/),
                              (v25/*: any*/),
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
                      (v26/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\"],dimensionRange:\"*-*\",first:20,medium:\"*\",sort:\"-decayed_merch\")"
          },
          {
            "alias": "fairArtworks",
            "args": (v18/*: any*/),
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
              "aggregations"
            ],
            "handle": "connection",
            "key": "Fair_fairArtworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          },
          {
            "alias": "exhibitors",
            "args": (v27/*: any*/),
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
                            "selections": (v28/*: any*/),
                            "type": "Partner",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": (v28/*: any*/),
                            "type": "ExternalPartner",
                            "abstractKey": null
                          },
                          (v26/*: any*/)
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
                                        "selections": (v24/*: any*/),
                                        "storageKey": null
                                      },
                                      {
                                        "alias": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkHighestBid",
                                        "kind": "LinkedField",
                                        "name": "highestBid",
                                        "plural": false,
                                        "selections": (v24/*: any*/),
                                        "storageKey": null
                                      },
                                      (v25/*: any*/),
                                      (v23/*: any*/),
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
                                      (v22/*: any*/),
                                      (v21/*: any*/),
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
                  (v19/*: any*/)
                ],
                "storageKey": null
              },
              (v20/*: any*/)
            ],
            "storageKey": "showsConnection(first:15,sort:\"FEATURED_ASC\")"
          },
          {
            "alias": "exhibitors",
            "args": (v27/*: any*/),
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
    "id": "0ae67ed58f477527546b20593316e62d",
    "metadata": {},
    "name": "Fair2TestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f798451e6e6d390e226e7d5ffcf097fd';
export default node;
