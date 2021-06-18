/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2b0bd79afafb610b57c20026f7139a91 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AuctionResultForYouContainerTestsQueryVariables = {
    first: number;
    after?: string | null;
};
export type AuctionResultForYouContainerTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"AuctionResultForYouContainer_me">;
    } | null;
};
export type AuctionResultForYouContainerTestsQuery = {
    readonly response: AuctionResultForYouContainerTestsQueryResponse;
    readonly variables: AuctionResultForYouContainerTestsQueryVariables;
};



/*
query AuctionResultForYouContainerTestsQuery(
  $first: Int!
  $after: String
) {
  me {
    ...AuctionResultForYouContainer_me_2HEEH6
    id
  }
}

fragment AuctionResultForYouContainer_me_2HEEH6 on Me {
  auctionResultsByFollowedArtists(first: $first, after: $after) {
    totalCount
    edges {
      node {
        id
        artistID
        internalID
        artist {
          name
          id
        }
        title
        currency
        dateText
        mediumText
        saleDate
        organization
        boughtIn
        priceRealized {
          cents
          display
        }
        performance {
          mid
        }
        images {
          thumbnail {
            url
          }
        }
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
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v6 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "kind": "Fragment",
    "metadata": null,
    "name": "AuctionResultForYouContainerTestsQuery",
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
            "name": "AuctionResultForYouContainer_me"
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
    "name": "AuctionResultForYouContainerTestsQuery",
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
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "name",
                            "storageKey": null
                          },
                          (v3/*: any*/)
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
                        "kind": "ScalarField",
                        "name": "mediumText",
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
                            "name": "cents",
                            "storageKey": null
                          },
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
                                "args": null,
                                "kind": "ScalarField",
                                "name": "url",
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
    "id": "2b0bd79afafb610b57c20026f7139a91",
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
        "me.auctionResultsByFollowedArtists.edges.node.artist": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artist"
        },
        "me.auctionResultsByFollowedArtists.edges.node.artist.id": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.artist.name": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.artistID": (v4/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.boughtIn": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "me.auctionResultsByFollowedArtists.edges.node.currency": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.dateText": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.id": (v5/*: any*/),
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
        "me.auctionResultsByFollowedArtists.edges.node.images.thumbnail.url": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.internalID": (v5/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.mediumText": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.organization": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.performance": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionLotPerformance"
        },
        "me.auctionResultsByFollowedArtists.edges.node.performance.mid": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "AuctionResultPriceRealized"
        },
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized.cents": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "me.auctionResultsByFollowedArtists.edges.node.priceRealized.display": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.saleDate": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.edges.node.title": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "PageInfo"
        },
        "me.auctionResultsByFollowedArtists.pageInfo.endCursor": (v6/*: any*/),
        "me.auctionResultsByFollowedArtists.pageInfo.hasNextPage": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.auctionResultsByFollowedArtists.totalCount": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Int"
        },
        "me.id": (v5/*: any*/)
      }
    },
    "name": "AuctionResultForYouContainerTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e3b6fb4f6c2e746f6b199d0024f28ef2';
export default node;
