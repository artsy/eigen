/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 947483109386ad8ff7057bbd29f7da2b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResultTestsQueryVariables = {
    auctionResultInternalID: string;
    artistID: string;
};
export type AuctionResultTestsQueryResponse = {
    readonly auctionResult: {
        readonly " $fragmentRefs": FragmentRefs<"AuctionResult_auctionResult">;
    } | null;
    readonly artist: {
        readonly " $fragmentRefs": FragmentRefs<"AuctionResult_artist">;
    } | null;
};
export type AuctionResultTestsQuery = {
    readonly response: AuctionResultTestsQueryResponse;
    readonly variables: AuctionResultTestsQueryVariables;
};



/*
query AuctionResultTestsQuery(
  $auctionResultInternalID: String!
  $artistID: String!
) {
  auctionResult(id: $auctionResultInternalID) {
    ...AuctionResult_auctionResult
    id
  }
  artist(id: $artistID) {
    ...AuctionResult_artist
    id
  }
}

fragment AuctionResultListItem_auctionResult on AuctionResult {
  currency
  dateText
  id
  internalID
  artist {
    name
    id
  }
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
  performance {
    mid
  }
  priceRealized {
    cents
    display
    displayUSD
  }
  saleDate
  title
}

fragment AuctionResult_artist on Artist {
  name
  href
}

fragment AuctionResult_auctionResult on AuctionResult {
  id
  internalID
  artistID
  boughtIn
  currency
  categoryText
  dateText
  dimensions {
    height
    width
  }
  dimensionText
  estimate {
    display
    high
    low
  }
  images {
    thumbnail {
      url(version: "square140")
      height
      width
      aspectRatio
    }
  }
  location
  mediumText
  organization
  performance {
    mid
  }
  priceRealized {
    cents
    centsUSD
    display
    displayUSD
  }
  saleDate
  saleTitle
  title
  ...ComparableWorks_auctionResult
}

fragment ComparableWorks_auctionResult on AuctionResult {
  comparableAuctionResults(first: 3) @optionalField {
    edges {
      cursor
      node {
        ...AuctionResultListItem_auctionResult
        artistID
        internalID
        id
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "artistID"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "auctionResultInternalID"
},
v2 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "auctionResultInternalID"
  }
],
v3 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistID",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "boughtIn",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dateText",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "display",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "low",
  "storageKey": null
},
v14 = {
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
        (v10/*: any*/),
        (v11/*: any*/),
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
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediumText",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organization",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotPerformance",
  "kind": "LinkedField",
  "name": "performance",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "mid",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cents",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayUSD",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleDate",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v23 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v25 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionResult"
},
v27 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotEstimate"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotImages"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v33 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v35 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotPerformance"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionResultPriceRealized"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionResultTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AuctionResult",
        "kind": "LinkedField",
        "name": "auctionResult",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AuctionResult_auctionResult"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "AuctionResult_artist"
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
    "argumentDefinitions": [
      (v1/*: any*/),
      (v0/*: any*/)
    ],
    "kind": "Operation",
    "name": "AuctionResultTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v2/*: any*/),
        "concreteType": "AuctionResult",
        "kind": "LinkedField",
        "name": "auctionResult",
        "plural": false,
        "selections": [
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "categoryText",
            "storageKey": null
          },
          (v9/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AuctionLotDimensions",
            "kind": "LinkedField",
            "name": "dimensions",
            "plural": false,
            "selections": [
              (v10/*: any*/),
              (v11/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "dimensionText",
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
              (v12/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "high",
                "storageKey": null
              },
              (v13/*: any*/)
            ],
            "storageKey": null
          },
          (v14/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "location",
            "storageKey": null
          },
          (v15/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "AuctionResultPriceRealized",
            "kind": "LinkedField",
            "name": "priceRealized",
            "plural": false,
            "selections": [
              (v18/*: any*/),
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "centsUSD",
                "storageKey": null
              },
              (v12/*: any*/),
              (v19/*: any*/)
            ],
            "storageKey": null
          },
          (v20/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "saleTitle",
            "storageKey": null
          },
          (v21/*: any*/),
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 3
              }
            ],
            "concreteType": "AuctionResultConnection",
            "kind": "LinkedField",
            "name": "comparableAuctionResults",
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
                    "kind": "ScalarField",
                    "name": "cursor",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionResult",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          (v4/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionLotEstimate",
                        "kind": "LinkedField",
                        "name": "estimate",
                        "plural": false,
                        "selections": [
                          (v13/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v7/*: any*/),
                      (v17/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionResultPriceRealized",
                        "kind": "LinkedField",
                        "name": "priceRealized",
                        "plural": false,
                        "selections": [
                          (v18/*: any*/),
                          (v12/*: any*/),
                          (v19/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v6/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "comparableAuctionResults(first:3)"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v3/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v22/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "href",
            "storageKey": null
          },
          (v4/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "947483109386ad8ff7057bbd29f7da2b",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": (v23/*: any*/),
        "artist.href": (v24/*: any*/),
        "artist.id": (v25/*: any*/),
        "artist.name": (v24/*: any*/),
        "auctionResult": (v26/*: any*/),
        "auctionResult.artistID": (v27/*: any*/),
        "auctionResult.boughtIn": (v28/*: any*/),
        "auctionResult.categoryText": (v24/*: any*/),
        "auctionResult.comparableAuctionResults": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultConnection"
        },
        "auctionResult.comparableAuctionResults.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionResultEdge"
        },
        "auctionResult.comparableAuctionResults.edges.cursor": (v27/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node": (v26/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist": (v23/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist.id": (v25/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist.name": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artistID": (v27/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.boughtIn": (v28/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.currency": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.dateText": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.estimate": (v29/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.estimate.low": (v30/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.id": (v25/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images": (v31/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.aspectRatio": (v33/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.height": (v34/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.url": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.width": (v34/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.internalID": (v25/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.mediumText": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.organization": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.performance": (v35/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.performance.mid": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized": (v36/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.cents": (v30/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.display": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.displayUSD": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.saleDate": (v24/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.title": (v24/*: any*/),
        "auctionResult.currency": (v24/*: any*/),
        "auctionResult.dateText": (v24/*: any*/),
        "auctionResult.dimensionText": (v24/*: any*/),
        "auctionResult.dimensions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotDimensions"
        },
        "auctionResult.dimensions.height": (v30/*: any*/),
        "auctionResult.dimensions.width": (v30/*: any*/),
        "auctionResult.estimate": (v29/*: any*/),
        "auctionResult.estimate.display": (v24/*: any*/),
        "auctionResult.estimate.high": (v30/*: any*/),
        "auctionResult.estimate.low": (v30/*: any*/),
        "auctionResult.id": (v25/*: any*/),
        "auctionResult.images": (v31/*: any*/),
        "auctionResult.images.thumbnail": (v32/*: any*/),
        "auctionResult.images.thumbnail.aspectRatio": (v33/*: any*/),
        "auctionResult.images.thumbnail.height": (v34/*: any*/),
        "auctionResult.images.thumbnail.url": (v24/*: any*/),
        "auctionResult.images.thumbnail.width": (v34/*: any*/),
        "auctionResult.internalID": (v25/*: any*/),
        "auctionResult.location": (v24/*: any*/),
        "auctionResult.mediumText": (v24/*: any*/),
        "auctionResult.organization": (v24/*: any*/),
        "auctionResult.performance": (v35/*: any*/),
        "auctionResult.performance.mid": (v24/*: any*/),
        "auctionResult.priceRealized": (v36/*: any*/),
        "auctionResult.priceRealized.cents": (v30/*: any*/),
        "auctionResult.priceRealized.centsUSD": (v30/*: any*/),
        "auctionResult.priceRealized.display": (v24/*: any*/),
        "auctionResult.priceRealized.displayUSD": (v24/*: any*/),
        "auctionResult.saleDate": (v24/*: any*/),
        "auctionResult.saleTitle": (v24/*: any*/),
        "auctionResult.title": (v24/*: any*/)
      }
    },
    "name": "AuctionResultTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '42d83eb35492ee598c741c20dc1235c5';
export default node;
