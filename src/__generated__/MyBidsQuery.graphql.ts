/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3337c7843c8d5e901c078b31a5aebc5b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBidsQueryVariables = {};
export type MyBidsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
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
}

fragment ActiveLot_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lot {
    internalID
    bidCount
    reserveStatus
    soldStatus
    askingPrice: onlineAskingPrice {
      display
    }
    sellingPrice {
      display
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      internalID
      href
      slug
      id
    }
    sale {
      liveStartAt
      id
    }
    id
  }
}

fragment ClosedLot_lotStanding on AuctionsLotStanding {
  isHighestBidder
  lot {
    internalID
    saleId
    bidCount
    reserveStatus
    soldStatus
    sellingPrice {
      display
    }
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      internalID
      href
      slug
      id
    }
    sale {
      endAt
      status
      id
    }
    id
  }
}

fragment Lot_saleArtwork on SaleArtwork {
  lotLabel
  artwork {
    artistNames
    image {
      url(version: "medium")
    }
    id
  }
}

fragment MyBids_me on Me {
  ...SaleCard_me
  identityVerified
  bidders(active: true) {
    sale {
      ...SaleCard_sale
      registrationStatus {
        qualifiedForBidding
        id
      }
      internalID
      liveStartAt
      endAt
      status
      id
    }
    id
  }
  auctionsLotStandingConnection(first: 25, after: "") {
    edges {
      node {
        ...ActiveLot_lotStanding
        ...ClosedLot_lotStanding
        lot {
          internalID
          saleId
          soldStatus
          id
        }
        saleArtwork {
          position
          sale {
            ...SaleCard_sale
            internalID
            liveStartAt
            endAt
            status
            id
          }
          id
        }
        id
        __typename
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  watchedLotConnection(first: 25, after: "") {
    edges {
      node {
        internalID
        ...WatchedLot_lotStanding
      }
    }
  }
}

fragment SaleCard_me on Me {
  identityVerified
  pendingIdentityVerification {
    internalID
    id
  }
}

fragment SaleCard_sale on Sale {
  internalID
  href
  slug
  name
  liveStartAt
  endAt
  coverImage {
    url
  }
  partner {
    name
    id
  }
  registrationStatus {
    qualifiedForBidding
    id
  }
  requireIdentityVerification
}

fragment WatchedLot_lotStanding on Lot {
  internalID
  saleArtwork {
    id
    lotLabel
    artwork {
      href
      artist {
        name
        id
      }
      myLotStanding {
        isHighestBidder
        isLeadingBidder
      }
      id
    }
  }
  lot {
    internalID
    bidCount
    sellingPrice {
      display
    }
    soldStatus
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
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
  "name": "liveStartAt",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "concreteType": "Image",
  "kind": "LinkedField",
  "name": "coverImage",
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
},
v8 = [
  (v4/*: any*/),
  (v1/*: any*/)
],
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": (v8/*: any*/),
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "concreteType": "Bidder",
  "kind": "LinkedField",
  "name": "registrationStatus",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "qualifiedForBidding",
      "storageKey": null
    },
    (v1/*: any*/)
  ],
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requireIdentityVerification",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v13 = [
  {
    "kind": "Literal",
    "name": "after",
    "value": ""
  },
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  }
],
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isHighestBidder",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v17 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v18 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v17/*: any*/),
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyBidsQuery",
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
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyBids_me"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyBidsQuery",
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
            "args": null,
            "kind": "ScalarField",
            "name": "identityVerified",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "IdentityVerification",
            "kind": "LinkedField",
            "name": "pendingIdentityVerification",
            "plural": false,
            "selections": [
              (v0/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "active",
                "value": true
              }
            ],
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "bidders",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  (v0/*: any*/),
                  (v2/*: any*/),
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/),
                  (v7/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
                  (v12/*: any*/),
                  (v1/*: any*/)
                ],
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": "bidders(active:true)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "concreteType": "AuctionsLotStandingConnection",
            "kind": "LinkedField",
            "name": "auctionsLotStandingConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "AuctionsLotStandingEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "AuctionsLotStanding",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v14/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v0/*: any*/),
                          (v15/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          (v16/*: any*/),
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "Money",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v17/*: any*/),
                            "storageKey": null
                          },
                          (v18/*: any*/),
                          (v1/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "saleId",
                            "storageKey": null
                          }
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
                          (v19/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
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
                                "concreteType": "Image",
                                "kind": "LinkedField",
                                "name": "image",
                                "plural": false,
                                "selections": [
                                  {
                                    "alias": null,
                                    "args": [
                                      {
                                        "kind": "Literal",
                                        "name": "version",
                                        "value": "medium"
                                      }
                                    ],
                                    "kind": "ScalarField",
                                    "name": "url",
                                    "storageKey": "url(version:\"medium\")"
                                  }
                                ],
                                "storageKey": null
                              },
                              (v1/*: any*/),
                              (v0/*: any*/),
                              (v2/*: any*/),
                              (v3/*: any*/)
                            ],
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
                              (v5/*: any*/),
                              (v1/*: any*/),
                              (v6/*: any*/),
                              (v12/*: any*/),
                              (v0/*: any*/),
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v7/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "position",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/),
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
                "concreteType": "AuctionsPageInfo",
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
            "storageKey": "auctionsLotStandingConnection(after:\"\",first:25)"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyBids_auctionsLotStandingConnection",
            "kind": "LinkedHandle",
            "name": "auctionsLotStandingConnection"
          },
          {
            "alias": null,
            "args": (v13/*: any*/),
            "concreteType": "LotConnection",
            "kind": "LinkedField",
            "name": "watchedLotConnection",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "LotEdge",
                "kind": "LinkedField",
                "name": "edges",
                "plural": true,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "Lot",
                    "kind": "LinkedField",
                    "name": "node",
                    "plural": false,
                    "selections": [
                      (v0/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "SaleArtwork",
                        "kind": "LinkedField",
                        "name": "saleArtwork",
                        "plural": false,
                        "selections": [
                          (v1/*: any*/),
                          (v19/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "Artist",
                                "kind": "LinkedField",
                                "name": "artist",
                                "plural": false,
                                "selections": (v8/*: any*/),
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "LotStanding",
                                "kind": "LinkedField",
                                "name": "myLotStanding",
                                "plural": true,
                                "selections": [
                                  (v14/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "kind": "ScalarField",
                                    "name": "isLeadingBidder",
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              },
                              (v1/*: any*/)
                            ],
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v0/*: any*/),
                          (v15/*: any*/),
                          (v18/*: any*/),
                          (v16/*: any*/),
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(after:\"\",first:25)"
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "3337c7843c8d5e901c078b31a5aebc5b",
    "metadata": {},
    "name": "MyBidsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '981b9c40ce8be1aaa7b0e0ee02952b42';
export default node;
