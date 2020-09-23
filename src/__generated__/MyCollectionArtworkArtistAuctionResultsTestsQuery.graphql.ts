/* tslint:disable */
/* eslint-disable */
/* @relayHash 0b7d528f697edb42ad906eebbec1be50 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkArtistAuctionResultsTestsQueryVariables = {};
export type MyCollectionArtworkArtistAuctionResultsTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkArtistAuctionResults_artwork">;
    } | null;
};
export type MyCollectionArtworkArtistAuctionResultsTestsQuery = {
    readonly response: MyCollectionArtworkArtistAuctionResultsTestsQueryResponse;
    readonly variables: MyCollectionArtworkArtistAuctionResultsTestsQueryVariables;
};



/*
query MyCollectionArtworkArtistAuctionResultsTestsQuery {
  artwork(id: "some-slug") {
    ...MyCollectionArtworkArtistAuctionResults_artwork
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
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-slug"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": true
},
v3 = {
  "type": "ID",
  "enumValues": null,
  "plural": false,
  "nullable": false
},
v4 = {
  "type": "String",
  "enumValues": null,
  "plural": false,
  "nullable": true
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistAuctionResults_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"some-slug\")",
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
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "slug",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "auctionResultsConnection",
                "storageKey": "auctionResultsConnection(first:3,sort:\"DATE_DESC\")",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "first",
                    "value": 3
                  },
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
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "internalID",
                            "args": null,
                            "storageKey": null
                          },
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
                                "selections": [
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "url",
                                    "args": null,
                                    "storageKey": null
                                  }
                                ]
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
                          (v1/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              (v1/*: any*/)
            ]
          },
          (v1/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "id": "32344ad8f7bd88916aefd9e981064720",
    "text": null,
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "type": "Artwork",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.id": (v2/*: any*/),
        "artwork.artist": {
          "type": "Artist",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.slug": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection": {
          "type": "AuctionResultConnection",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.id": (v2/*: any*/),
        "artwork.artist.auctionResultsConnection.edges": {
          "type": "AuctionResultEdge",
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
        "artwork.artist.auctionResultsConnection.edges.node.internalID": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.title": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dimensionText": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images": {
          "type": "AuctionLotImages",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.description": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dateText": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.saleDate": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized": {
          "type": "AuctionResultPriceRealized",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.id": (v2/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail": {
          "type": "Image",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.display": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.centsUSD": {
          "type": "Float",
          "enumValues": null,
          "plural": false,
          "nullable": true
        },
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.url": (v4/*: any*/)
      }
    }
  }
};
})();
(node as any).hash = 'c16e41c028e78ada6aad675e538b4182';
export default node;
