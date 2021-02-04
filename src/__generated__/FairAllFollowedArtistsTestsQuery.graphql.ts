/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 87da43180d6beb47aea3e3e519641a93 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairAllFollowedArtistsTestsQueryVariables = {
    fairID: string;
};
export type FairAllFollowedArtistsTestsQueryResponse = {
    readonly fair: {
        readonly " $fragmentRefs": FragmentRefs<"FairAllFollowedArtists_fair">;
    } | null;
    readonly fairForFilters: {
        readonly " $fragmentRefs": FragmentRefs<"FairAllFollowedArtists_fairForFilters">;
    } | null;
};
export type FairAllFollowedArtistsTestsQuery = {
    readonly response: FairAllFollowedArtistsTestsQueryResponse;
    readonly variables: FairAllFollowedArtistsTestsQueryVariables;
};



/*
query FairAllFollowedArtistsTestsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    ...FairAllFollowedArtists_fair
    id
  }
  fairForFilters: fair(id: $fairID) {
    ...FairAllFollowedArtists_fairForFilters
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

fragment FairAllFollowedArtists_fair on Fair {
  internalID
  slug
  ...FairArtworks_fair_485l1x
}

fragment FairAllFollowedArtists_fairForFilters on Fair {
  filterArtworksConnection(first: 0, aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST]) {
    aggregations {
      slice
      counts {
        count
        name
        value
      }
    }
    counts {
      followedArtists
    }
    id
  }
}

fragment FairArtworks_fair_485l1x on Fair {
  slug
  internalID
  fairArtworks: filterArtworksConnection(first: 30, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", includeArtworksByFollowedArtists: true, aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE, FOLLOWED_ARTISTS, ARTIST]) {
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
v5 = [
  (v4/*: any*/),
  {
    "kind": "Literal",
    "name": "dimensionRange",
    "value": "*-*"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 30
  },
  {
    "kind": "Literal",
    "name": "includeArtworksByFollowedArtists",
    "value": true
  },
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
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v7 = {
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
        (v6/*: any*/),
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
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "followedArtists",
  "storageKey": null
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Fair"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksConnection"
},
v13 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "ArtworksAggregationResults"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "AggregationCount"
},
v16 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v17 = {
  "enumValues": [
    "ARTIST",
    "ARTIST_NATIONALITY",
    "ATTRIBUTION_CLASS",
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
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FilterArtworksCounts"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "FairAllFollowedArtistsTestsQuery",
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
            "name": "FairAllFollowedArtists_fair"
          }
        ],
        "storageKey": null
      },
      {
        "alias": "fairForFilters",
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "FairAllFollowedArtists_fairForFilters"
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
    "name": "FairAllFollowedArtistsTestsQuery",
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
            "alias": "fairArtworks",
            "args": (v5/*: any*/),
            "concreteType": "FilterArtworksConnection",
            "kind": "LinkedField",
            "name": "filterArtworksConnection",
            "plural": false,
            "selections": [
              (v7/*: any*/),
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
                      (v8/*: any*/),
                      (v9/*: any*/)
                    ],
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  }
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
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
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
              (v8/*: any*/),
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
                      (v9/*: any*/),
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "aspectRatio",
                                "storageKey": null
                              },
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
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleMessage",
                            "storageKey": null
                          },
                          (v2/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "href",
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isAuction",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isClosed",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "displayTimelyAt",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "endAt",
                                "storageKey": null
                              },
                              (v8/*: any*/)
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
                              {
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
                              {
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
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "lotLabel",
                                "storageKey": null
                              },
                              (v8/*: any*/)
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
                              (v6/*: any*/),
                              (v8/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v8/*: any*/)
                        ],
                        "type": "Node",
                        "abstractKey": "__isNode"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "type": "ArtworkConnectionInterface",
                "abstractKey": "__isArtworkConnectionInterface"
              }
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],dimensionRange:\"*-*\",first:30,includeArtworksByFollowedArtists:true,medium:\"*\",sort:\"-decayed_merch\")"
          },
          {
            "alias": "fairArtworks",
            "args": (v5/*: any*/),
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
          (v8/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": "fairForFilters",
        "args": (v1/*: any*/),
        "concreteType": "Fair",
        "kind": "LinkedField",
        "name": "fair",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": [
              (v4/*: any*/),
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
              (v7/*: any*/),
              {
                "alias": null,
                "args": null,
                "concreteType": "FilterArtworksCounts",
                "kind": "LinkedField",
                "name": "counts",
                "plural": false,
                "selections": [
                  (v10/*: any*/)
                ],
                "storageKey": null
              },
              (v8/*: any*/)
            ],
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\",\"FOLLOWED_ARTISTS\",\"ARTIST\"],first:0)"
          },
          (v8/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "87da43180d6beb47aea3e3e519641a93",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "fair": (v11/*: any*/),
        "fair.fairArtworks": (v12/*: any*/),
        "fair.fairArtworks.__isArtworkConnectionInterface": (v13/*: any*/),
        "fair.fairArtworks.aggregations": (v14/*: any*/),
        "fair.fairArtworks.aggregations.counts": (v15/*: any*/),
        "fair.fairArtworks.aggregations.counts.count": (v16/*: any*/),
        "fair.fairArtworks.aggregations.counts.name": (v13/*: any*/),
        "fair.fairArtworks.aggregations.counts.value": (v13/*: any*/),
        "fair.fairArtworks.aggregations.slice": (v17/*: any*/),
        "fair.fairArtworks.counts": (v18/*: any*/),
        "fair.fairArtworks.counts.followedArtists": (v19/*: any*/),
        "fair.fairArtworks.counts.total": (v19/*: any*/),
        "fair.fairArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "fair.fairArtworks.edges.__isNode": (v13/*: any*/),
        "fair.fairArtworks.edges.__typename": (v13/*: any*/),
        "fair.fairArtworks.edges.cursor": (v13/*: any*/),
        "fair.fairArtworks.edges.id": (v20/*: any*/),
        "fair.fairArtworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "fair.fairArtworks.edges.node.__typename": (v13/*: any*/),
        "fair.fairArtworks.edges.node.artistNames": (v21/*: any*/),
        "fair.fairArtworks.edges.node.date": (v21/*: any*/),
        "fair.fairArtworks.edges.node.href": (v21/*: any*/),
        "fair.fairArtworks.edges.node.id": (v20/*: any*/),
        "fair.fairArtworks.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "fair.fairArtworks.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "fair.fairArtworks.edges.node.image.url": (v21/*: any*/),
        "fair.fairArtworks.edges.node.internalID": (v20/*: any*/),
        "fair.fairArtworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "fair.fairArtworks.edges.node.partner.id": (v20/*: any*/),
        "fair.fairArtworks.edges.node.partner.name": (v21/*: any*/),
        "fair.fairArtworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "fair.fairArtworks.edges.node.sale.displayTimelyAt": (v21/*: any*/),
        "fair.fairArtworks.edges.node.sale.endAt": (v21/*: any*/),
        "fair.fairArtworks.edges.node.sale.id": (v20/*: any*/),
        "fair.fairArtworks.edges.node.sale.isAuction": (v22/*: any*/),
        "fair.fairArtworks.edges.node.sale.isClosed": (v22/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "fair.fairArtworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "fair.fairArtworks.edges.node.saleArtwork.counts.bidderPositions": (v19/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "fair.fairArtworks.edges.node.saleArtwork.currentBid.display": (v21/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.id": (v20/*: any*/),
        "fair.fairArtworks.edges.node.saleArtwork.lotLabel": (v21/*: any*/),
        "fair.fairArtworks.edges.node.saleMessage": (v21/*: any*/),
        "fair.fairArtworks.edges.node.slug": (v20/*: any*/),
        "fair.fairArtworks.edges.node.title": (v21/*: any*/),
        "fair.fairArtworks.id": (v20/*: any*/),
        "fair.fairArtworks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "fair.fairArtworks.pageInfo.endCursor": (v21/*: any*/),
        "fair.fairArtworks.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "fair.fairArtworks.pageInfo.startCursor": (v21/*: any*/),
        "fair.id": (v20/*: any*/),
        "fair.internalID": (v20/*: any*/),
        "fair.slug": (v20/*: any*/),
        "fairForFilters": (v11/*: any*/),
        "fairForFilters.filterArtworksConnection": (v12/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations": (v14/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations.counts": (v15/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations.counts.count": (v16/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations.counts.name": (v13/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations.counts.value": (v13/*: any*/),
        "fairForFilters.filterArtworksConnection.aggregations.slice": (v17/*: any*/),
        "fairForFilters.filterArtworksConnection.counts": (v18/*: any*/),
        "fairForFilters.filterArtworksConnection.counts.followedArtists": (v19/*: any*/),
        "fairForFilters.filterArtworksConnection.id": (v20/*: any*/),
        "fairForFilters.id": (v20/*: any*/)
      }
    },
    "name": "FairAllFollowedArtistsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'dcf6037aa5312eba178640a2be04ca3d';
export default node;
