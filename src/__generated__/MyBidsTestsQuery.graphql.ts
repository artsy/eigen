/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d9398cfb2033da47b0d487c4d9b408d3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyBidsTestsQueryVariables = {};
export type MyBidsTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyBids_me">;
    } | null;
};
export type MyBidsTestsQuery = {
    readonly response: MyBidsTestsQueryResponse;
    readonly variables: MyBidsTestsQueryVariables;
};



/*
query MyBidsTestsQuery {
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

fragment LotStatusListItem_lot on LotLike {
  __isLotLike: __typename
  type: __typename
  lot {
    soldStatus
    id
  }
  ...ActiveLot_lotStanding
  ...ClosedLot_lotStanding
  ...WatchedLot_lot
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
      internalID
      ...SaleCard_sale
      registrationStatus {
        qualifiedForBidding
        id
      }
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
        ...LotStatusListItem_lot
        ...ClosedLot_lotStanding
        __typename
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
      }
      cursor
    }
    pageInfo {
      endCursor
      hasNextPage
    }
  }
  watchedLotConnection(first: 20, after: "") {
    edges {
      node {
        ...LotStatusListItem_lot
        lot {
          internalID
          id
        }
        saleArtwork {
          internalID
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

fragment WatchedLot_lot on Lot {
  lotState: lot {
    internalID
    bidCount
    sellingPrice {
      display
    }
    soldStatus
    id
  }
  saleArtwork {
    ...Lot_saleArtwork
    artwork {
      href
      id
    }
    sale {
      liveStartAt
      endAt
      status
      id
    }
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
v2 = [
  (v0/*: any*/),
  (v1/*: any*/)
],
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "href",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "liveStartAt",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "endAt",
  "storageKey": null
},
v8 = {
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
v9 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v5/*: any*/),
    (v1/*: any*/)
  ],
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
v13 = {
  "alias": null,
  "args": null,
  "concreteType": "Sale",
  "kind": "LinkedField",
  "name": "sale",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/),
    (v5/*: any*/),
    (v6/*: any*/),
    (v7/*: any*/),
    (v8/*: any*/),
    (v9/*: any*/),
    (v10/*: any*/),
    (v11/*: any*/),
    (v12/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "kind": "Literal",
  "name": "after",
  "value": ""
},
v15 = [
  (v14/*: any*/),
  {
    "kind": "Literal",
    "name": "first",
    "value": 25
  }
],
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isHighestBidder",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "saleId",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "reserveStatus",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v21 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v22 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v21/*: any*/),
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v24 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v25 = {
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
v26 = {
  "alias": null,
  "args": null,
  "concreteType": "Artwork",
  "kind": "LinkedField",
  "name": "artwork",
  "plural": false,
  "selections": [
    (v24/*: any*/),
    (v25/*: any*/),
    (v1/*: any*/),
    (v0/*: any*/),
    (v3/*: any*/),
    (v4/*: any*/)
  ],
  "storageKey": null
},
v27 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v28 = {
  "alias": "type",
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v29 = {
  "alias": "askingPrice",
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "onlineAskingPrice",
  "plural": false,
  "selections": (v21/*: any*/),
  "storageKey": null
},
v30 = {
  "alias": "lotState",
  "args": null,
  "concreteType": "AuctionsLotState",
  "kind": "LinkedField",
  "name": "lot",
  "plural": false,
  "selections": [
    (v0/*: any*/),
    (v18/*: any*/),
    (v22/*: any*/),
    (v20/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
},
v31 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v32 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v33 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v34 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "AuctionsLotState"
},
v35 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v36 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v37 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v38 = {
  "enumValues": [
    "NoReserve",
    "ReserveMet",
    "ReserveNotMet"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsReserveStatus"
},
v39 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v40 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "SaleArtwork"
},
v41 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v42 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v43 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v44 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v45 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v46 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v47 = {
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
    "name": "MyBidsTestsQuery",
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
    "name": "MyBidsTestsQuery",
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
            "selections": (v2/*: any*/),
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
              (v13/*: any*/),
              (v1/*: any*/)
            ],
            "storageKey": "bidders(active:true)"
          },
          {
            "alias": null,
            "args": (v15/*: any*/),
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
                      (v16/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v0/*: any*/),
                          (v17/*: any*/),
                          (v18/*: any*/),
                          (v19/*: any*/),
                          (v20/*: any*/),
                          (v22/*: any*/),
                          (v1/*: any*/)
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
                          (v23/*: any*/),
                          (v26/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v7/*: any*/),
                              (v12/*: any*/),
                              (v1/*: any*/),
                              (v0/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/),
                              (v11/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          (v27/*: any*/)
                        ],
                        "storageKey": null
                      },
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "__typename",
                        "storageKey": null
                      },
                      (v1/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v28/*: any*/),
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AuctionsLotState",
                                "kind": "LinkedField",
                                "name": "lot",
                                "plural": false,
                                "selections": [
                                  (v29/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "AuctionsLotStanding",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v30/*: any*/)
                            ],
                            "type": "Lot",
                            "abstractKey": null
                          }
                        ],
                        "type": "LotLike",
                        "abstractKey": "__isLotLike"
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
            "args": (v15/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyBids_auctionsLotStandingConnection",
            "kind": "LinkedHandle",
            "name": "auctionsLotStandingConnection"
          },
          {
            "alias": null,
            "args": [
              (v14/*: any*/),
              {
                "kind": "Literal",
                "name": "first",
                "value": 20
              }
            ],
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
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": (v2/*: any*/),
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
                          (v0/*: any*/),
                          (v27/*: any*/),
                          (v13/*: any*/),
                          (v1/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "selections": [
                          (v28/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "AuctionsLotState",
                            "kind": "LinkedField",
                            "name": "lot",
                            "plural": false,
                            "selections": [
                              (v20/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v16/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "AuctionsLotState",
                                "kind": "LinkedField",
                                "name": "lot",
                                "plural": false,
                                "selections": [
                                  (v18/*: any*/),
                                  (v19/*: any*/),
                                  (v29/*: any*/),
                                  (v22/*: any*/),
                                  (v17/*: any*/)
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
                                  (v23/*: any*/),
                                  (v26/*: any*/)
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "AuctionsLotStanding",
                            "abstractKey": null
                          },
                          {
                            "kind": "InlineFragment",
                            "selections": [
                              (v30/*: any*/),
                              {
                                "alias": null,
                                "args": null,
                                "concreteType": "SaleArtwork",
                                "kind": "LinkedField",
                                "name": "saleArtwork",
                                "plural": false,
                                "selections": [
                                  (v23/*: any*/),
                                  {
                                    "alias": null,
                                    "args": null,
                                    "concreteType": "Artwork",
                                    "kind": "LinkedField",
                                    "name": "artwork",
                                    "plural": false,
                                    "selections": [
                                      (v24/*: any*/),
                                      (v25/*: any*/),
                                      (v1/*: any*/),
                                      (v3/*: any*/)
                                    ],
                                    "storageKey": null
                                  }
                                ],
                                "storageKey": null
                              }
                            ],
                            "type": "Lot",
                            "abstractKey": null
                          }
                        ],
                        "type": "LotLike",
                        "abstractKey": "__isLotLike"
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(after:\"\",first:20)"
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d9398cfb2033da47b0d487c4d9b408d3",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.auctionsLotStandingConnection": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStandingConnection"
        },
        "me.auctionsLotStandingConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "AuctionsLotStandingEdge"
        },
        "me.auctionsLotStandingConnection.edges.cursor": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.__isLotLike": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.__typename": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v35/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.reserveStatus": (v38/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v35/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v39/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.bidCount": (v37/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.internalID": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice": (v35/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.sellingPrice.display": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lotState.soldStatus": (v39/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v40/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v41/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": (v43/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v44/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v42/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v45/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v46/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v47/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v47/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v36/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.type": (v31/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsPageInfo"
        },
        "me.auctionsLotStandingConnection.pageInfo.endCursor": (v36/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo.hasNextPage": (v33/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v32/*: any*/),
        "me.bidders.sale": (v44/*: any*/),
        "me.bidders.sale.coverImage": (v42/*: any*/),
        "me.bidders.sale.coverImage.url": (v36/*: any*/),
        "me.bidders.sale.endAt": (v36/*: any*/),
        "me.bidders.sale.href": (v36/*: any*/),
        "me.bidders.sale.id": (v32/*: any*/),
        "me.bidders.sale.internalID": (v32/*: any*/),
        "me.bidders.sale.liveStartAt": (v36/*: any*/),
        "me.bidders.sale.name": (v36/*: any*/),
        "me.bidders.sale.partner": (v45/*: any*/),
        "me.bidders.sale.partner.id": (v32/*: any*/),
        "me.bidders.sale.partner.name": (v36/*: any*/),
        "me.bidders.sale.registrationStatus": (v46/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v32/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v47/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v47/*: any*/),
        "me.bidders.sale.slug": (v32/*: any*/),
        "me.bidders.sale.status": (v36/*: any*/),
        "me.id": (v32/*: any*/),
        "me.identityVerified": (v47/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v32/*: any*/),
        "me.pendingIdentityVerification.internalID": (v32/*: any*/),
        "me.watchedLotConnection": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "LotConnection"
        },
        "me.watchedLotConnection.edges": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "LotEdge"
        },
        "me.watchedLotConnection.edges.node": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Lot"
        },
        "me.watchedLotConnection.edges.node.__isLotLike": (v31/*: any*/),
        "me.watchedLotConnection.edges.node.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.isHighestBidder": (v33/*: any*/),
        "me.watchedLotConnection.edges.node.lot": (v34/*: any*/),
        "me.watchedLotConnection.edges.node.lot.askingPrice": (v35/*: any*/),
        "me.watchedLotConnection.edges.node.lot.askingPrice.display": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.lot.bidCount": (v37/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lot.reserveStatus": (v38/*: any*/),
        "me.watchedLotConnection.edges.node.lot.saleId": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v35/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v39/*: any*/),
        "me.watchedLotConnection.edges.node.lotState": (v34/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.bidCount": (v37/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.internalID": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.sellingPrice": (v35/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.sellingPrice.display": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.lotState.soldStatus": (v39/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v40/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v41/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artistNames": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image.url": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.internalID": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.slug": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.internalID": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.position": (v43/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale": (v44/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage": (v42/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage.url": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.endAt": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.href": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.internalID": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.liveStartAt": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.name": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner": (v45/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.name": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus": (v46/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v47/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v47/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.slug": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.status": (v36/*: any*/),
        "me.watchedLotConnection.edges.node.type": (v31/*: any*/)
      }
    },
    "name": "MyBidsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'b171cc29f771a471afbf0365e3b1cc5e';
export default node;
