/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1514db1b8ad6997234b0bd26bd40eda1 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResultForYouTestsQueryVariables = {
    first: number;
    after?: string | null;
};
export type AuctionResultForYouTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"AuctionResultForYou_me">;
    } | null;
};
export type AuctionResultForYouTestsQuery = {
    readonly response: AuctionResultForYouTestsQueryResponse;
    readonly variables: AuctionResultForYouTestsQueryVariables;
};



/*
query AuctionResultForYouTestsQuery(
  $first: Int!
  $after: String
) {
  me {
    ...AuctionResultForYou_me_2HEEH6
    id
  }
}

fragment AuctionResultForYou_me_2HEEH6 on Me {
  auctionResultsByFollowedArtists(first: $first, after: $after) {
    totalCount
    edges {
      node {
        currency
        dateText
        id
        artistID
        internalID
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
          display
          cents
        }
        saleDate
        title
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
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "after"
},
v1 = {
  "defaultValue": null,
  "kind": "LocalArgument",
  "name": "first"
},
v2 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "first"
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
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v5 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v7 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v8 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionResultForYouTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": (v2/*: any*/),
            "kind": "FragmentSpread",
            "name": "AuctionResultForYou_me"
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
    "name": "AuctionResultForYouTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "AuctionResultConnection",
            "kind": "LinkedField",
            "name": "auctionResultsByFollowedArtists",
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
                    "concreteType": "AuctionResult",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
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
                      (v3/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "artistID",
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "internalID",
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
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      }
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
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "AuctionResultForYouContainer_auctionResultsByFollowedArtists",
            "kind": "LinkedHandle",
            "name": "auctionResultsByFollowedArtists"
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "1514db1b8ad6997234b0bd26bd40eda1",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.auctionResultsByFollowedArtists": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultConnection"
        },
        "me.auctionResultsByFollowedArtists.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionResultEdge"
        },
        "me.auctionResultsByFollowedArtists.edges.cursor": (v4/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResult"
        },
        "me.auctionResultsByFollowedArtists.edges.node.__typename": (v4/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.artistID": (v4/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.boughtIn": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "me.auctionResultsByFollowedArtists.edges.node.currency": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.dateText": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.estimate": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotEstimate"
        },
        "me.auctionResultsByFollowedArtists.edges.node.estimate.low": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.id": (v7/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.images": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotImages"
        },
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail.aspectRatio": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Float"
        },
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail.height": (v8/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail.url": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail.width": (v8/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.internalID": (v7/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.mediumText": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.organization": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.performance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotPerformance"
        },
        "me.auctionResultsByFollowedArtists.edges.node.performance.mid": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultPriceRealized"
        },
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized.cents": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized.display": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.saleDate": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.title": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.auctionResultsByFollowedArtists.pageInfo.endCursor": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.auctionResultsByFollowedArtists.totalCount": (v8/*: any*/),
        "me.id": (v7/*: any*/)
      }
    },
    "name": "AuctionResultForYouTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '014e1258a03ca013b9d79b311bc696c1';
export default node;
