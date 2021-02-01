/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 97396d53e8317450bbd85096ce63517b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesArtworksTestsQueryVariables = {};
export type ArtistSeriesArtworksTestsQueryResponse = {
    readonly artistSeries: {
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesArtworks_artistSeries">;
    } | null;
};
export type ArtistSeriesArtworksTestsQuery = {
    readonly response: ArtistSeriesArtworksTestsQueryResponse;
    readonly variables: ArtistSeriesArtworksTestsQueryVariables;
};



/*
query ArtistSeriesArtworksTestsQuery {
  artistSeries(id: "pumpkins") {
    ...ArtistSeriesArtworks_artistSeries
  }
}

fragment ArtistSeriesArtworks_artistSeries on ArtistSeries {
  slug
  internalID
  artistSeriesArtworks: filterArtworksConnection(first: 20, sort: "-decayed_merch", medium: "*", dimensionRange: "*-*", aggregations: [COLOR, DIMENSION_RANGE, GALLERY, INSTITUTION, MAJOR_PERIOD, MEDIUM, PRICE_RANGE]) {
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
    }
    ...InfiniteScrollArtworksGrid_connection
    pageInfo {
      endCursor
      hasNextPage
    }
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
    "kind": "Literal",
    "name": "id",
    "value": "pumpkins"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v3 = [
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
      "PRICE_RANGE"
    ]
  },
  {
    "kind": "Literal",
    "name": "dimensionRange",
    "value": "*-*"
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 20
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
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
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
  "name": "__typename",
  "storageKey": null
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "FormattedNumber"
},
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtistSeriesArtworksTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "kind": "LinkedField",
        "name": "artistSeries",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ArtistSeriesArtworks_artistSeries"
          }
        ],
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "ArtistSeriesArtworksTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "ArtistSeries",
        "kind": "LinkedField",
        "name": "artistSeries",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          {
            "alias": "artistSeriesArtworks",
            "args": (v3/*: any*/),
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
                      (v4/*: any*/),
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
                      (v6/*: any*/)
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
                  }
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
                      (v6/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
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
                              (v4/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v5/*: any*/)
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
            "storageKey": "filterArtworksConnection(aggregations:[\"COLOR\",\"DIMENSION_RANGE\",\"GALLERY\",\"INSTITUTION\",\"MAJOR_PERIOD\",\"MEDIUM\",\"PRICE_RANGE\"],dimensionRange:\"*-*\",first:20,medium:\"*\",sort:\"-decayed_merch\")"
          },
          {
            "alias": "artistSeriesArtworks",
            "args": (v3/*: any*/),
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
              "aggregations",
              "attributionClass"
            ],
            "handle": "connection",
            "key": "ArtistSeries_artistSeriesArtworks",
            "kind": "LinkedHandle",
            "name": "filterArtworksConnection"
          }
        ],
        "storageKey": "artistSeries(id:\"pumpkins\")"
      }
    ]
  },
  "params": {
    "id": "97396d53e8317450bbd85096ce63517b",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artistSeries": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ArtistSeries"
        },
        "artistSeries.artistSeriesArtworks": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksConnection"
        },
        "artistSeries.artistSeriesArtworks.__isArtworkConnectionInterface": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.aggregations": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworksAggregationResults"
        },
        "artistSeries.artistSeriesArtworks.aggregations.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AggregationCount"
        },
        "artistSeries.artistSeriesArtworks.aggregations.counts.count": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Int"
        },
        "artistSeries.artistSeriesArtworks.aggregations.counts.name": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.aggregations.counts.value": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.aggregations.slice": {
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
        "artistSeries.artistSeriesArtworks.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "FilterArtworksCounts"
        },
        "artistSeries.artistSeriesArtworks.counts.total": (v8/*: any*/),
        "artistSeries.artistSeriesArtworks.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "ArtworkEdgeInterface"
        },
        "artistSeries.artistSeriesArtworks.edges.__isNode": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.__typename": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.cursor": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artistSeries.artistSeriesArtworks.edges.node.__typename": (v7/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.artistNames": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.date": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.href": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artistSeries.artistSeriesArtworks.edges.node.image.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "artistSeries.artistSeriesArtworks.edges.node.image.url": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.internalID": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.partner": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Partner"
        },
        "artistSeries.artistSeriesArtworks.edges.node.partner.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.partner.name": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.sale": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Sale"
        },
        "artistSeries.artistSeriesArtworks.edges.node.sale.displayTimelyAt": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.sale.endAt": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.sale.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.sale.isAuction": (v11/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.sale.isClosed": (v11/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtwork"
        },
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.counts": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCounts"
        },
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.counts.bidderPositions": (v8/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.currentBid": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SaleArtworkCurrentBid"
        },
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.currentBid.display": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.saleArtwork.lotLabel": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.saleMessage": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.slug": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.edges.node.title": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.id": (v9/*: any*/),
        "artistSeries.artistSeriesArtworks.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "artistSeries.artistSeriesArtworks.pageInfo.endCursor": (v10/*: any*/),
        "artistSeries.artistSeriesArtworks.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "artistSeries.artistSeriesArtworks.pageInfo.startCursor": (v10/*: any*/),
        "artistSeries.internalID": (v9/*: any*/),
        "artistSeries.slug": (v7/*: any*/)
      }
    },
    "name": "ArtistSeriesArtworksTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '7a4097e5054860f120b054c5de7938dc';
export default node;
