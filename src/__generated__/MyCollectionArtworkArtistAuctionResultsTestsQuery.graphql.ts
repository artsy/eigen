/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
<<<<<<< HEAD
/* @relayHash 825f8179f117a4717da62975d4f1a2e6 */
=======
/* @relayHash 89afd9d1e51909390b34335aebd18b05 */
>>>>>>> master

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

fragment AuctionResult_auctionResult on AuctionResult {
  currency
  dateText
  id
<<<<<<< HEAD
  internalID
=======
>>>>>>> master
  images {
    thumbnail {
      url(version: "square140")
      height
      width
      aspectRatio
    }
  }
  estimate {
    low
  }
  mediumText
  organization
  boughtIn
  priceRealized {
    display
    cents
  }
  saleDate
  title
}

fragment MyCollectionArtworkArtistAuctionResults_artwork on Artwork {
  internalID
  slug
  artist {
    slug
    name
    auctionResultsConnection(first: 3, sort: DATE_DESC) {
      edges {
        node {
          id
<<<<<<< HEAD
          internalID
=======
>>>>>>> master
          ...AuctionResult_auctionResult
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
  "name": "id",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v6 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
<<<<<<< HEAD
v7 = {
=======
v6 = {
>>>>>>> master
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkArtistAuctionResults_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "internalID",
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Artist",
            "kind": "LinkedField",
            "name": "artist",
            "plural": false,
            "selections": [
              (v1/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "name",
                "storageKey": null
              },
              {
                "alias": null,
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
                "kind": "LinkedField",
                "name": "auctionResultsConnection",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionResultEdge",
                    "kind": "LinkedField",
                    "name": "edges",
                    "plural": true,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionResult",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
<<<<<<< HEAD
                          (v3/*: any*/),
                          (v1/*: any*/),
=======
                          (v2/*: any*/),
>>>>>>> master
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "currency",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "dateText",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionLotImages",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "thumbnail",
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
                                  },
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "height",
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
                                    "name": "aspectRatio",
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
                            "concreteType": "AuctionLotEstimate",
                            "kind": "LinkedField",
                            "name": "estimate",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "low",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "mediumText",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "organization",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "boughtIn",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionResultPriceRealized",
                            "kind": "LinkedField",
                            "name": "priceRealized",
                            "plural": false,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "display",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "cents",
                                "storageKey": null
                              }
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleDate",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": "auctionResultsConnection(first:3,sort:\"DATE_DESC\")"
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
<<<<<<< HEAD
    "id": "825f8179f117a4717da62975d4f1a2e6",
=======
    "id": "89afd9d1e51909390b34335aebd18b05",
>>>>>>> master
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "artwork.artist.auctionResultsConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultConnection"
        },
        "artwork.artist.auctionResultsConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionResultEdge"
        },
        "artwork.artist.auctionResultsConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResult"
        },
        "artwork.artist.auctionResultsConnection.edges.node.boughtIn": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
<<<<<<< HEAD
        "artwork.artist.auctionResultsConnection.edges.node.currency": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dateText": (v4/*: any*/),
=======
        "artwork.artist.auctionResultsConnection.edges.node.currency": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.dateText": (v3/*: any*/),
>>>>>>> master
        "artwork.artist.auctionResultsConnection.edges.node.estimate": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotEstimate"
        },
<<<<<<< HEAD
        "artwork.artist.auctionResultsConnection.edges.node.estimate.low": (v5/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.id": (v6/*: any*/),
=======
        "artwork.artist.auctionResultsConnection.edges.node.estimate.low": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.id": (v5/*: any*/),
>>>>>>> master
        "artwork.artist.auctionResultsConnection.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotImages"
        },
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
<<<<<<< HEAD
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.height": (v7/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.url": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.width": (v7/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.internalID": (v6/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.mediumText": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.organization": (v4/*: any*/),
=======
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.height": (v6/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.url": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.images.thumbnail.width": (v6/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.mediumText": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.organization": (v3/*: any*/),
>>>>>>> master
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultPriceRealized"
        },
<<<<<<< HEAD
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.cents": (v5/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.display": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.saleDate": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.title": (v4/*: any*/),
        "artwork.artist.id": (v6/*: any*/),
        "artwork.artist.name": (v4/*: any*/),
        "artwork.artist.slug": (v6/*: any*/),
        "artwork.id": (v6/*: any*/),
        "artwork.internalID": (v6/*: any*/),
        "artwork.slug": (v6/*: any*/)
=======
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.cents": (v4/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.priceRealized.display": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.saleDate": (v3/*: any*/),
        "artwork.artist.auctionResultsConnection.edges.node.title": (v3/*: any*/),
        "artwork.artist.id": (v5/*: any*/),
        "artwork.artist.name": (v3/*: any*/),
        "artwork.artist.slug": (v5/*: any*/),
        "artwork.id": (v5/*: any*/),
        "artwork.internalID": (v5/*: any*/),
        "artwork.slug": (v5/*: any*/)
>>>>>>> master
      }
    },
    "name": "MyCollectionArtworkArtistAuctionResultsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c16e41c028e78ada6aad675e538b4182';
export default node;
