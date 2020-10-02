/* tslint:disable */
/* eslint-disable */
/* @relayHash 5437bad864156f61fd88e26e1f0611db */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkInsightsTestsQueryVariables = {};
export type MyCollectionArtworkInsightsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_artwork">;
    } | null;
    readonly marketPriceInsights: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkInsights_marketPriceInsights">;
    } | null;
};
export type MyCollectionArtworkInsightsTestsQuery = {
    readonly response: MyCollectionArtworkInsightsTestsQueryResponse;
    readonly variables: MyCollectionArtworkInsightsTestsQueryVariables;
};



/*
query MyCollectionArtworkInsightsTestsQuery {
  artwork(id: "some-artwork-id") {
    ...MyCollectionArtworkInsights_artwork
    id
  }
  marketPriceInsights(artistId: "some-artist-id", medium: "painting") {
    ...MyCollectionArtworkInsights_marketPriceInsights
  }
}

fragment MyCollectionArtworkArtistArticles_artwork on Artwork {
  artist {
    slug
    articlesConnection(first: 3, sort: PUBLISHED_AT_DESC, inEditorialFeed: true) {
      edges {
        node {
          slug
          internalID
          href
          thumbnailTitle
          author {
            name
            id
          }
          publishedAt(format: "MMM Do, YYYY")
          thumbnailImage {
            url
          }
          id
        }
      }
    }
    id
  }
}

fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
  artist {
    slug
    auctionResultsConnection(first: 3, sort: DATE_DESC) {
      edges {
        node {
          internalID
          title
          dimensionText
          images {
            thumbnail {
              url
            }
          }
          description
          dateText
          saleDate
          priceRealized {
            display
            centsUSD
          }
          id
        }
      }
    }
    id
  }
}

fragment MyCollectionArtworkArtistMarket_marketPriceInsights on MarketPriceInsights {
  annualLotsSold
  annualValueSoldCents
  sellThroughRate
  medianSaleToEstimateRatio
  liquidityRank
  demandTrend
}

fragment MyCollectionArtworkDemandIndex_marketPriceInsights on MarketPriceInsights {
  demandRank
}

fragment MyCollectionArtworkInsights_artwork on Artwork {
  ...MyCollectionArtworkArtistAuctionResults_artwork
  ...MyCollectionArtworkArtistArticles_artwork
}

fragment MyCollectionArtworkInsights_marketPriceInsights on MarketPriceInsights {
  ...MyCollectionArtworkDemandIndex_marketPriceInsights
  ...MyCollectionArtworkPriceEstimate_marketPriceInsights
  ...MyCollectionArtworkArtistMarket_marketPriceInsights
}

fragment MyCollectionArtworkPriceEstimate_marketPriceInsights on MarketPriceInsights {
  lowRangeCents
  midRangeCents
  highRangeCents
  artsyQInventory
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-artwork-id"
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "artistId",
    "value": "some-artist-id"
  },
  {
    "kind": "Literal",
    "name": "medium",
    "value": "painting"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "Literal",
  "name": "first",
  "value": 3
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
],
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v7 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v8 = {
  "type": "Float",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v9 = {
  "type": "BigInt",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v10 = {
  "type": "Int",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v11 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v12 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v13 = {
  "type": "Image",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-artwork-id\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_artwork",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")",
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkInsights_marketPriceInsights",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-artwork-id\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artist",
            "storageKey": null,
            "args": null,
            "concreteType": "Artist",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "auctionResultsConnection",
                "storageKey": "auctionResultsConnection(first:3,sort:\"DATE_DESC\")",
                "args": [
                  (v3/*: any*/),
                  {
                    "kind": "Literal",
                    "name": "sort",
                    "value": "DATE_DESC"
                  }
                ],
                "concreteType": "AuctionResultConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AuctionResultEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AuctionResult",
                        "plural": false,
                        "selections": [
                          (v4/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "title",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "dimensionText",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "images",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AuctionLotImages",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "LinkedField",
                                "alias": null,
                                "name": "thumbnail",
                                "storageKey": null,
                                "args": null,
                                "concreteType": "Image",
                                "plural": false,
                                "selections": (v5/*: any*/)
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "description",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "dateText",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "saleDate",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "priceRealized",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AuctionResultPriceRealized",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "display",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "centsUSD",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          (v6/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v6/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "articlesConnection",
                "storageKey": "articlesConnection(first:3,inEditorialFeed:true,sort:\"PUBLISHED_AT_DESC\")",
                "args": [
                  (v3/*: any*/),
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
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Article",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "href",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "thumbnailTitle",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "author",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Author",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "name",
                                "args": null,
                                "storageKey": null
                              },
                              (v6/*: any*/)
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "publishedAt",
                            "args": [
                              {
                                "kind": "Literal",
                                "name": "format",
                                "value": "MMM Do, YYYY"
                              }
                            ],
                            "storageKey": "publishedAt(format:\"MMM Do, YYYY\")"
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "thumbnailImage",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v5/*: any*/)
                          },
                          (v6/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v6/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "marketPriceInsights",
        "storageKey": "marketPriceInsights(artistId:\"some-artist-id\",medium:\"painting\")",
        "args": (v1/*: any*/),
        "concreteType": "MarketPriceInsights",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "demandRank",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "lowRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "midRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "highRangeCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "artsyQInventory",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "annualLotsSold",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "annualValueSoldCents",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "sellThroughRate",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "medianSaleToEstimateRatio",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "liquidityRank",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "demandTrend",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkInsightsTestsQuery",
    "id": "6653710b13d0141ee6dae59d2c8af249",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights": {
          "type": "MarketPriceInsights",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v7/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "marketPriceInsights.demandRank": (v8/*: any*/),
        "marketPriceInsights.lowRangeCents": (v9/*: any*/),
        "marketPriceInsights.midRangeCents": (v9/*: any*/),
        "marketPriceInsights.highRangeCents": (v9/*: any*/),
        "marketPriceInsights.artsyQInventory": (v10/*: any*/),
        "marketPriceInsights.annualLotsSold": (v10/*: any*/),
        "marketPriceInsights.annualValueSoldCents": (v9/*: any*/),
        "marketPriceInsights.sellThroughRate": (v8/*: any*/),
        "marketPriceInsights.medianSaleToEstimateRatio": (v8/*: any*/),
        "marketPriceInsights.liquidityRank": (v8/*: any*/),
        "marketPriceInsights.demandTrend": (v8/*: any*/),
        "artwork.artist.slug": (v11/*: any*/),
        "artwork.artist.auctionResultsConnection": {
          "type": "AuctionResultConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.id": (v7/*: any*/),
        "artwork.artist.articlesConnection": {
          "type": "ArticleConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges": {
          "type": "AuctionResultEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges": {
          "type": "ArticleEdge",
          "enumValues": null,
          "plural": true,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node": {
          "type": "AuctionResult",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node": {
          "type": "Article",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.internalID": (v11/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.title": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dimensionText": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images": {
          "type": "AuctionLotImages",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.description": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dateText": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.saleDate": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized": {
          "type": "AuctionResultPriceRealized",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.id": (v7/*: any*/),
        "artwork.artist.articlesConnection.edges.node.slug": (v12/*: any*/),
        "artwork.artist.articlesConnection.edges.node.internalID": (v11/*: any*/),
        "artwork.artist.articlesConnection.edges.node.href": (v12/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailTitle": (v12/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author": {
          "type": "Author",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.articlesConnection.edges.node.publishedAt": (v12/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage": (v13/*: any*/),
        "artwork.artist.articlesConnection.edges.node.id": (v7/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail": (v13/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.display": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.centsUSD": (v8/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.name": (v12/*: any*/),
        "artwork.artist.articlesConnection.edges.node.author.id": (v7/*: any*/),
        "artwork.artist.articlesConnection.edges.node.thumbnailImage.url": (v12/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.url": (v12/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'cbb19540e1692c8f992a18876f4cd9ce';
export default node;
