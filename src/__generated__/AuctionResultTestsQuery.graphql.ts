/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 23670ebe2b8c937c531e86f17d0f56e9 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResultTestsQueryVariables = {
    auctionResultInternalID: string;
    artistID: string;
};
export type AuctionResultTestsQueryResponse = {
    readonly auctionResult: {
        readonly id: string;
        readonly internalID: string;
        readonly artistID: string;
        readonly boughtIn: boolean | null;
        readonly currency: string | null;
        readonly categoryText: string | null;
        readonly dateText: string | null;
        readonly dimensions: {
            readonly height: number | null;
            readonly width: number | null;
        } | null;
        readonly dimensionText: string | null;
        readonly estimate: {
            readonly display: string | null;
            readonly high: number | null;
            readonly low: number | null;
        } | null;
        readonly images: {
            readonly thumbnail: {
                readonly url: string | null;
                readonly height: number | null;
                readonly width: number | null;
                readonly aspectRatio: number;
            } | null;
        } | null;
        readonly location: string | null;
        readonly mediumText: string | null;
        readonly organization: string | null;
        readonly performance: {
            readonly mid: string | null;
        } | null;
        readonly priceRealized: {
            readonly cents: number | null;
            readonly centsUSD: number | null;
            readonly display: string | null;
            readonly displayUSD: string | null;
        } | null;
        readonly saleDate: string | null;
        readonly saleTitle: string | null;
        readonly title: string | null;
        readonly " $fragmentRefs": FragmentRefs<"ComparableWorks_auctionResult">;
    } | null;
    readonly artist: {
        readonly name: string | null;
        readonly href: string | null;
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
    id
    internalID
    artistID
    boughtIn
    currency
    categoryText
    ...ComparableWorks_auctionResult
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
  }
  artist(id: $artistID) {
    name
    href
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

fragment ComparableWorks_auctionResult on AuctionResult {
  comparableAuctionResults(first: 3) @optionalField {
    totalCount
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
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
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
  "name": "artistID",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "boughtIn",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "currency",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "categoryText",
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
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "dimensionText",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "display",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "low",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionLotEstimate",
  "kind": "LinkedField",
  "name": "estimate",
  "plural": false,
  "selections": [
    (v14/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "high",
      "storageKey": null
    },
    (v15/*: any*/)
  ],
  "storageKey": null
},
v17 = {
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
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "location",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "mediumText",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "organization",
  "storageKey": null
},
v21 = {
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
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cents",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "displayUSD",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "concreteType": "AuctionResultPriceRealized",
  "kind": "LinkedField",
  "name": "priceRealized",
  "plural": false,
  "selections": [
    (v22/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "centsUSD",
      "storageKey": null
    },
    (v14/*: any*/),
    (v23/*: any*/)
  ],
  "storageKey": null
},
v25 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleDate",
  "storageKey": null
},
v26 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleTitle",
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v28 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artistID"
  }
],
v29 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v30 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artist"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v33 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v34 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionResult"
},
v35 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v37 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotEstimate"
},
v38 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v39 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotImages"
},
v40 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v41 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Float"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v43 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "AuctionLotPerformance"
},
v44 = {
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
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
          (v9/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "ComparableWorks_auctionResult"
          }
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v28/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v29/*: any*/),
          (v30/*: any*/)
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
          (v3/*: any*/),
          (v4/*: any*/),
          (v5/*: any*/),
          (v6/*: any*/),
          (v7/*: any*/),
          (v8/*: any*/),
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
                "kind": "ScalarField",
                "name": "totalCount",
                "storageKey": null
              },
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
                      (v7/*: any*/),
                      (v9/*: any*/),
                      (v3/*: any*/),
                      (v4/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v29/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v17/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionLotEstimate",
                        "kind": "LinkedField",
                        "name": "estimate",
                        "plural": false,
                        "selections": [
                          (v15/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v6/*: any*/),
                      (v21/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionResultPriceRealized",
                        "kind": "LinkedField",
                        "name": "priceRealized",
                        "plural": false,
                        "selections": [
                          (v22/*: any*/),
                          (v14/*: any*/),
                          (v23/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v25/*: any*/),
                      (v27/*: any*/),
                      (v5/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "comparableAuctionResults(first:3)"
          },
          (v9/*: any*/),
          (v12/*: any*/),
          (v13/*: any*/),
          (v16/*: any*/),
          (v17/*: any*/),
          (v18/*: any*/),
          (v19/*: any*/),
          (v20/*: any*/),
          (v21/*: any*/),
          (v24/*: any*/),
          (v25/*: any*/),
          (v26/*: any*/),
          (v27/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": (v28/*: any*/),
        "concreteType": "Artist",
        "kind": "LinkedField",
        "name": "artist",
        "plural": false,
        "selections": [
          (v29/*: any*/),
          (v30/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "23670ebe2b8c937c531e86f17d0f56e9",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artist": (v31/*: any*/),
        "artist.href": (v32/*: any*/),
        "artist.id": (v33/*: any*/),
        "artist.name": (v32/*: any*/),
        "auctionResult": (v34/*: any*/),
        "auctionResult.artistID": (v35/*: any*/),
        "auctionResult.boughtIn": (v36/*: any*/),
        "auctionResult.categoryText": (v32/*: any*/),
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
        "auctionResult.comparableAuctionResults.edges.cursor": (v35/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node": (v34/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist": (v31/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist.id": (v33/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artist.name": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.artistID": (v35/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.boughtIn": (v36/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.currency": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.dateText": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.estimate": (v37/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.estimate.low": (v38/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.id": (v33/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images": (v39/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail": (v40/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.aspectRatio": (v41/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.height": (v42/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.url": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.images.thumbnail.width": (v42/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.internalID": (v33/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.mediumText": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.organization": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.performance": (v43/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.performance.mid": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized": (v44/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.cents": (v38/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.display": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.priceRealized.displayUSD": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.saleDate": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.edges.node.title": (v32/*: any*/),
        "auctionResult.comparableAuctionResults.totalCount": (v42/*: any*/),
        "auctionResult.currency": (v32/*: any*/),
        "auctionResult.dateText": (v32/*: any*/),
        "auctionResult.dimensionText": (v32/*: any*/),
        "auctionResult.dimensions": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotDimensions"
        },
        "auctionResult.dimensions.height": (v38/*: any*/),
        "auctionResult.dimensions.width": (v38/*: any*/),
        "auctionResult.estimate": (v37/*: any*/),
        "auctionResult.estimate.display": (v32/*: any*/),
        "auctionResult.estimate.high": (v38/*: any*/),
        "auctionResult.estimate.low": (v38/*: any*/),
        "auctionResult.id": (v33/*: any*/),
        "auctionResult.images": (v39/*: any*/),
        "auctionResult.images.thumbnail": (v40/*: any*/),
        "auctionResult.images.thumbnail.aspectRatio": (v41/*: any*/),
        "auctionResult.images.thumbnail.height": (v42/*: any*/),
        "auctionResult.images.thumbnail.url": (v32/*: any*/),
        "auctionResult.images.thumbnail.width": (v42/*: any*/),
        "auctionResult.internalID": (v33/*: any*/),
        "auctionResult.location": (v32/*: any*/),
        "auctionResult.mediumText": (v32/*: any*/),
        "auctionResult.organization": (v32/*: any*/),
        "auctionResult.performance": (v43/*: any*/),
        "auctionResult.performance.mid": (v32/*: any*/),
        "auctionResult.priceRealized": (v44/*: any*/),
        "auctionResult.priceRealized.cents": (v38/*: any*/),
        "auctionResult.priceRealized.centsUSD": (v38/*: any*/),
        "auctionResult.priceRealized.display": (v32/*: any*/),
        "auctionResult.priceRealized.displayUSD": (v32/*: any*/),
        "auctionResult.saleDate": (v32/*: any*/),
        "auctionResult.saleTitle": (v32/*: any*/),
        "auctionResult.title": (v32/*: any*/)
      }
    },
    "name": "AuctionResultTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '58320247214928c47d8945d320bd079b';
export default node;
