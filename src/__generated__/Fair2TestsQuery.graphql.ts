/* tslint:disable */
/* eslint-disable */
/* @relayHash cdd83a16bdd14d8b76924b6ebbc11d03 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkAggregation = "COLOR" | "DIMENSION_RANGE" | "FOLLOWED_ARTISTS" | "GALLERY" | "INSTITUTION" | "MAJOR_PERIOD" | "MEDIUM" | "MERCHANDISABLE_ARTISTS" | "PARTNER_CITY" | "PERIOD" | "PRICE_RANGE" | "TOTAL" | "%future added value";
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
            readonly id: string | null;
            readonly slug: string;
            readonly title: string;
            readonly category: string;
            readonly artworks: ({
                readonly edges: ReadonlyArray<({
                    readonly node: ({
                        readonly image: ({
                            readonly url: string | null;
                        }) | null;
                        readonly id: string | null;
                    }) | null;
                }) | null> | null;
                readonly id: string | null;
            }) | null;
        }) | null>;
        readonly counts: ({
            readonly artworks: number | null;
            readonly partnerShows: number | null;
        }) | null;
        readonly about: string | null;
        readonly summary: string | null;
        readonly name: string | null;
        readonly profile: ({
            readonly icon: ({
                readonly url: string | null;
            }) | null;
            readonly id: string | null;
        }) | null;
        readonly image: ({
            readonly url: string | null;
            readonly aspectRatio: number;
        }) | null;
        readonly tagline: string | null;
        readonly location: ({
            readonly summary: string | null;
            readonly id: string | null;
        }) | null;
        readonly ticketsLink: string | null;
        readonly hours: string | null;
        readonly links: string | null;
        readonly tickets: string | null;
        readonly contact: string | null;
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
                    readonly slug: string;
                    readonly image: ({
                        readonly aspectRatio: number;
                        readonly url: string | null;
                    }) | null;
                    readonly title: string | null;
                    readonly date: string | null;
                    readonly saleMessage: string | null;
                    readonly internalID: string;
                    readonly artistNames: string | null;
                    readonly href: string | null;
                    readonly sale: ({
                        readonly isAuction: boolean | null;
                        readonly isClosed: boolean | null;
                        readonly displayTimelyAt: string | null;
                        readonly endAt: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly saleArtwork: ({
                        readonly counts: ({
                            readonly bidderPositions: number | null;
                        }) | null;
                        readonly currentBid: ({
                            readonly display: string | null;
                        }) | null;
                        readonly lotLabel: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly partner: ({
                        readonly name: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly __typename: "Artwork";
                }) | null;
                readonly cursor: string;
                readonly id: string | null;
            }) | null> | null;
            readonly counts: ({
                readonly total: number | null;
                readonly followedArtists: number | null;
            }) | null;
            readonly pageInfo: {
                readonly hasNextPage: boolean;
                readonly startCursor: string | null;
                readonly endCursor: string | null;
            };
            readonly id: string | null;
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
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: "ExternalPartner";
                        readonly id: string | null;
                        readonly name: string | null;
                    } | {
                        readonly __typename: string | null;
                        readonly id: string | null;
                    }) | null;
                    readonly internalID: string;
                    readonly href: string | null;
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
                                    readonly id: string | null;
                                }) | null;
                                readonly sale: ({
                                    readonly isClosed: boolean | null;
                                    readonly isAuction: boolean | null;
                                    readonly endAt: string | null;
                                    readonly id: string | null;
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
        readonly id: string | null;
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
  articles: articlesConnection(first: 5, sort: PUBLISHED_AT_DESC) {
    edges {
      node {
        id
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
      id
    }
  }
  counts {
    artworks
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

fragment Fair2Header_fair on Fair {
  about
  summary
  name
  slug
  profile {
    icon {
      url(version: "untouched-png")
    }
    id
  }
  image {
    url(version: "large_rectangle")
    aspectRatio
  }
  tagline
  location {
    summary
    id
  }
  ticketsLink
  hours(format: MARKDOWN)
  links(format: MARKDOWN)
  tickets(format: MARKDOWN)
  contact(format: MARKDOWN)
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
  ...Fair2Header_fair
  ...Fair2Editorial_fair
  ...Fair2Collections_fair
  ...Fair2Artworks_fair
  ...Fair2Exhibitors_fair
}

fragment InfiniteScrollArtworksGrid_connection on ArtworkConnectionInterface {
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
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "title",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artworks",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "summary",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v11 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "aspectRatio",
  "args": null,
  "storageKey": null
},
v12 = [
  {
    "kind": "Literal",
    "name": "format",
    "value": "MARKDOWN"
  }
],
v13 = {
  "kind": "Literal",
  "name": "first",
  "value": 20
},
v14 = [
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
  (v13/*: any*/),
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
v15 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "saleMessage",
  "args": null,
  "storageKey": null
},
v16 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v17 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isAuction",
  "args": null,
  "storageKey": null
},
v18 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "isClosed",
  "args": null,
  "storageKey": null
},
v19 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "endAt",
  "args": null,
  "storageKey": null
},
v20 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "counts",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtworkCounts",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "bidderPositions",
      "args": null,
      "storageKey": null
    }
  ]
},
v21 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "display",
    "args": null,
    "storageKey": null
  }
],
v22 = {
  "kind": "LinkedField",
  "alias": null,
  "name": "currentBid",
  "storageKey": null,
  "args": null,
  "concreteType": "SaleArtworkCurrentBid",
  "plural": false,
  "selections": (v21/*: any*/)
},
v23 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cursor",
  "args": null,
  "storageKey": null
},
v24 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "hasNextPage",
  "args": null,
  "storageKey": null
},
v25 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "endCursor",
  "args": null,
  "storageKey": null
},
v26 = [
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
v27 = [
  (v10/*: any*/)
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "Fair2TestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "Fair2_fair",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "Fair2TestsQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "fair",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "LinkedField",
            "alias": "articles",
            "name": "articlesConnection",
            "storageKey": "articlesConnection(first:5,sort:\"PUBLISHED_AT_DESC\")",
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
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ArticleEdge",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Article",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "publishedAt",
                        "args": [
                          {
                            "kind": "Literal",
                            "name": "format",
                            "value": "MMM Do, YY"
                          }
                        ],
                        "storageKey": "publishedAt(format:\"MMM Do, YY\")"
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "thumbnailImage",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": "src",
                            "name": "imageURL",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "marketingCollections",
            "storageKey": "marketingCollections(size:4)",
            "args": [
              {
                "kind": "Literal",
                "name": "size",
                "value": 4
              }
            ],
            "concreteType": "MarketingCollection",
            "plural": true,
            "selections": [
              (v4/*: any*/),
              (v5/*: any*/),
              (v3/*: any*/),
              (v6/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "category",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": "artworks",
                "name": "artworksConnection",
                "storageKey": "artworksConnection(first:3)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  }
                ],
                "concreteType": "FilterArtworksConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "FilterArtworksEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "url",
                                "args": [
                                  {
                                    "kind": "Literal",
                                    "name": "version",
                                    "value": "larger"
                                  }
                                ],
                                "storageKey": "url(version:\"larger\")"
                              }
                            ]
                          },
                          (v5/*: any*/)
                        ]
                      }
                    ]
                  },
                  (v5/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "counts",
            "storageKey": null,
            "args": null,
            "concreteType": "FairCounts",
            "plural": false,
            "selections": [
              (v8/*: any*/),
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "partnerShows",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "about",
            "args": null,
            "storageKey": null
          },
          (v9/*: any*/),
          (v10/*: any*/),
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "profile",
            "storageKey": null,
            "args": null,
            "concreteType": "Profile",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "icon",
                "storageKey": null,
                "args": null,
                "concreteType": "Image",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "url",
                    "args": [
                      {
                        "kind": "Literal",
                        "name": "version",
                        "value": "untouched-png"
                      }
                    ],
                    "storageKey": "url(version:\"untouched-png\")"
                  }
                ]
              },
              (v5/*: any*/)
            ]
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "image",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "url",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": "large_rectangle"
                  }
                ],
                "storageKey": "url(version:\"large_rectangle\")"
              },
              (v11/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tagline",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "location",
            "storageKey": null,
            "args": null,
            "concreteType": "Location",
            "plural": false,
            "selections": [
              (v9/*: any*/),
              (v5/*: any*/)
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "ticketsLink",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "hours",
            "args": (v12/*: any*/),
            "storageKey": "hours(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "links",
            "args": (v12/*: any*/),
            "storageKey": "links(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "tickets",
            "args": (v12/*: any*/),
            "storageKey": "tickets(format:\"MARKDOWN\")"
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "contact",
            "args": (v12/*: any*/),
            "storageKey": "contact(format:\"MARKDOWN\")"
          },
          {
            "kind": "LinkedField",
            "alias": "fairArtworks",
            "name": "filterArtworksConnection",
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\"],dimensionRange:\"*-*\",first:20,medium:\"*\",sort:\"-decayed_merch\")",
            "args": (v14/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "aggregations",
                "storageKey": null,
                "args": null,
                "concreteType": "ArtworksAggregationResults",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "slice",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "counts",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AggregationCount",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "count",
                        "args": null,
                        "storageKey": null
                      },
                      (v10/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "value",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Artwork",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      (v3/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "image",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Image",
                        "plural": false,
                        "selections": [
                          (v11/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "url",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "version",
                                "value": "large"
                              }
                            ],
                            "storageKey": "url(version:\"large\")"
                          }
                        ]
                      },
                      (v6/*: any*/),
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "date",
                        "args": null,
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      (v2/*: any*/),
                      (v16/*: any*/),
                      (v7/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "sale",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Sale",
                        "plural": false,
                        "selections": [
                          (v17/*: any*/),
                          (v18/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "displayTimelyAt",
                            "args": null,
                            "storageKey": null
                          },
                          (v19/*: any*/),
                          (v5/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "saleArtwork",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "plural": false,
                        "selections": [
                          (v20/*: any*/),
                          (v22/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "lotLabel",
                            "args": null,
                            "storageKey": null
                          },
                          (v5/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Partner",
                        "plural": false,
                        "selections": [
                          (v10/*: any*/),
                          (v5/*: any*/)
                        ]
                      },
                      (v4/*: any*/)
                    ]
                  },
                  (v23/*: any*/),
                  (v5/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "counts",
                "storageKey": null,
                "args": null,
                "concreteType": "FilterArtworksCounts",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "total",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "followedArtists",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  (v24/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "startCursor",
                    "args": null,
                    "storageKey": null
                  },
                  (v25/*: any*/)
                ]
              },
              (v5/*: any*/)
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "fairArtworks",
            "name": "filterArtworksConnection",
            "args": (v14/*: any*/),
            "handle": "connection",
            "key": "Fair_fairArtworks",
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
            ]
          },
          {
            "kind": "LinkedField",
            "alias": "exhibitors",
            "name": "showsConnection",
            "storageKey": "showsConnection(first:15,sort:\"FEATURED_ASC\")",
            "args": (v26/*: any*/),
            "concreteType": "ShowConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "ShowEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "Show",
                    "plural": false,
                    "selections": [
                      (v5/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "counts",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "ShowCounts",
                        "plural": false,
                        "selections": [
                          (v8/*: any*/)
                        ]
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "partner",
                        "storageKey": null,
                        "args": null,
                        "concreteType": null,
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          (v5/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "type": "Partner",
                            "selections": (v27/*: any*/)
                          },
                          {
                            "kind": "InlineFragment",
                            "type": "ExternalPartner",
                            "selections": (v27/*: any*/)
                          }
                        ]
                      },
                      (v2/*: any*/),
                      (v7/*: any*/),
                      {
                        "kind": "LinkedField",
                        "alias": "artworks",
                        "name": "artworksConnection",
                        "storageKey": "artworksConnection(first:20)",
                        "args": [
                          (v13/*: any*/)
                        ],
                        "concreteType": "ArtworkConnection",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "edges",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "ArtworkEdge",
                            "plural": true,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "node",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Artwork",
                                "plural": false,
                                "selections": [
                                  (v7/*: any*/),
                                  (v16/*: any*/),
                                  (v5/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "image",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Image",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "ScalarField",
                                        "alias": null,
                                        "name": "imageURL",
                                        "args": null,
                                        "storageKey": null
                                      },
                                      (v11/*: any*/)
                                    ]
                                  },
                                  (v15/*: any*/),
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "saleArtwork",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "SaleArtwork",
                                    "plural": false,
                                    "selections": [
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "openingBid",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkOpeningBid",
                                        "plural": false,
                                        "selections": (v21/*: any*/)
                                      },
                                      {
                                        "kind": "LinkedField",
                                        "alias": null,
                                        "name": "highestBid",
                                        "storageKey": null,
                                        "args": null,
                                        "concreteType": "SaleArtworkHighestBid",
                                        "plural": false,
                                        "selections": (v21/*: any*/)
                                      },
                                      (v22/*: any*/),
                                      (v20/*: any*/),
                                      (v5/*: any*/)
                                    ]
                                  },
                                  {
                                    "kind": "LinkedField",
                                    "alias": null,
                                    "name": "sale",
                                    "storageKey": null,
                                    "args": null,
                                    "concreteType": "Sale",
                                    "plural": false,
                                    "selections": [
                                      (v18/*: any*/),
                                      (v17/*: any*/),
                                      (v19/*: any*/),
                                      (v5/*: any*/)
                                    ]
                                  },
                                  (v6/*: any*/),
                                  (v2/*: any*/),
                                  (v3/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      },
                      (v4/*: any*/)
                    ]
                  },
                  (v23/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "pageInfo",
                "storageKey": null,
                "args": null,
                "concreteType": "PageInfo",
                "plural": false,
                "selections": [
                  (v25/*: any*/),
                  (v24/*: any*/)
                ]
              }
            ]
          },
          {
            "kind": "LinkedHandle",
            "alias": "exhibitors",
            "name": "showsConnection",
            "args": (v26/*: any*/),
            "handle": "connection",
            "key": "Fair2ExhibitorsQuery_exhibitors",
            "filters": [
              "sort"
            ]
          },
          (v5/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "Fair2TestsQuery",
    "id": "9ececaf96a76b586004a36e549184705",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'f798451e6e6d390e226e7d5ffcf097fd';
export default node;
