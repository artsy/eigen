/* tslint:disable */
/* eslint-disable */
/* @relayHash e8bb78f999412858d0f0298e809b5349 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBidsQueryVariables = {};
export type MyBidsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
    } | null;
    readonly sales: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_sales">;
    } | null;
};
export type MyBidsQuery = {
    readonly response: MyBidsQueryResponse;
    readonly variables: MyBidsQueryVariables;
};



/*
query MyBidsQuery {
  me {
    ...MyBids_me
    id
  }
  sales: salesConnection(first: 100, registered: true) {
    ...MyBids_sales
  }
}

fragment MyBids_me on Me {
  auctionsLotStandingConnection(first: 25) {
    edges {
      node {
        isHighestBidder
        lotState {
          saleId
          bidCount
          soldStatus
          onlineAskingPrice {
            displayAmount
          }
          floorSellingPrice {
            displayAmount
          }
          id
        }
        saleArtwork {
          id
          lotLabel
          artwork {
            artistNames
            href
            image {
              url(version: "medium")
            }
            id
          }
        }
        id
      }
    }
  }
}

fragment MyBids_sales on SaleConnection {
  edges {
    node {
      internalID
      saleType
      href
      endAt
      liveStartAt
      displayTimelyAt
      timeZone
      name
      slug
      coverImage {
        url
      }
      partner {
        name
        id
      }
      id
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "first",
    "value": 100
  },
  {
    "kind": "Literal",
    "name": "registered",
    "value": true
  }
],
v1 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "displayAmount",
    "args": null,
    "storageKey": null
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyBidsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyBids_me",
            "args": null
          }
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "sales",
        "name": "salesConnection",
        "storageKey": "salesConnection(first:100,registered:true)",
        "args": (v0/*: any*/),
        "concreteType": "SaleConnection",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyBids_sales",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyBidsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "auctionsLotStandingConnection",
            "storageKey": "auctionsLotStandingConnection(first:25)",
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 25
              }
            ],
            "concreteType": "AuctionsLotStandingConnection",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "edges",
                "storageKey": null,
                "args": null,
                "concreteType": "AuctionsLotStandingEdge",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "node",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "AuctionsLotStanding",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "isHighestBidder",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "lotState",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "plural": false,
                        "selections": [
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "saleId",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "bidCount",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "soldStatus",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "onlineAskingPrice",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AuctionsMoney",
                            "plural": false,
                            "selections": (v1/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "floorSellingPrice",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "AuctionsMoney",
                            "plural": false,
                            "selections": (v1/*: any*/)
                          },
                          (v2/*: any*/)
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
                          (v2/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "lotLabel",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "artwork",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "artistNames",
                                "args": null,
                                "storageKey": null
                              },
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
                                  {
                                    "kind": "ScalarField",
                                    "alias": null,
                                    "name": "url",
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "medium"
                                      }
                                    ],
                                    "storageKey": "url(version:\"medium\")"
                                  }
                                ]
                              },
                              (v2/*: any*/)
                            ]
                          }
                        ]
                      },
                      (v2/*: any*/)
                    ]
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      },
      {
        "kind": "LinkedField",
        "alias": "sales",
        "name": "salesConnection",
        "storageKey": "salesConnection(first:100,registered:true)",
        "args": (v0/*: any*/),
        "concreteType": "SaleConnection",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "edges",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleEdge",
            "plural": true,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "node",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
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
                    "name": "saleType",
                    "args": null,
                    "storageKey": null
                  },
                  (v3/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "endAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "liveStartAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "displayTimelyAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "timeZone",
                    "args": null,
                    "storageKey": null
                  },
                  (v4/*: any*/),
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
                    "name": "coverImage",
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
                      (v4/*: any*/),
                      (v2/*: any*/)
                    ]
                  },
                  (v2/*: any*/)
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MyBidsQuery",
    "id": "bde660fdf0065b6828815b3af9bdc95d",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '37cc2e854a634d2ebc478bff476e0a70';
export default node;
