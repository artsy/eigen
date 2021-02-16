/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b7f53790491aad4c167721d6fe4a7728 */

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

fragment ActiveLotStanding_lotStanding on AuctionsLotStanding {
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

fragment ClosedLotStanding_lotStanding on AuctionsLotStanding {
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

fragment LotStatusListItem_lot on Lot {
  ...WatchedLot_lot
}

fragment LotStatusListItem_lotStanding on AuctionsLotStanding {
  ...ActiveLotStanding_lotStanding
  ...ClosedLotStanding_lotStanding
  lot {
    soldStatus
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
  auctionsLotStandingConnection(first: 50) {
    edges {
      node {
        isHighestBidder
        ...LotStatusListItem_lotStanding
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
    }
  }
  watchedLotConnection(first: 100) {
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
  lot {
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
      internalID
      href
      slug
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
v8 = {
  "alias": null,
  "args": null,
  "concreteType": "Partner",
  "kind": "LinkedField",
  "name": "partner",
  "plural": false,
  "selections": [
    (v4/*: any*/),
    (v1/*: any*/)
  ],
  "storageKey": null
},
v9 = {
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
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "requireIdentityVerification",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "status",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v14 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v15 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v14/*: any*/),
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v17 = {
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
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "position",
  "storageKey": null
},
v19 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "AuctionsLotState"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v23 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v24 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v26 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v27 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Float"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v32 = {
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
                  (v8/*: any*/),
                  (v9/*: any*/),
                  (v10/*: any*/),
                  (v11/*: any*/),
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
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 50
              }
            ],
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
                      {
                        "alias": null,
                        "args": null,
                        "kind": "ScalarField",
                        "name": "isHighestBidder",
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
                          (v12/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          (v13/*: any*/),
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "Money",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v14/*: any*/),
                            "storageKey": null
                          },
                          (v15/*: any*/),
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
                          (v16/*: any*/),
                          (v17/*: any*/),
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
                              (v11/*: any*/),
                              (v0/*: any*/),
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          (v18/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "auctionsLotStandingConnection(first:50)"
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "first",
                "value": 100
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
                        "selections": [
                          (v0/*: any*/),
                          (v12/*: any*/),
                          (v15/*: any*/),
                          (v13/*: any*/),
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
                          (v16/*: any*/),
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Sale",
                            "kind": "LinkedField",
                            "name": "sale",
                            "plural": false,
                            "selections": [
                              (v5/*: any*/),
                              (v6/*: any*/),
                              (v11/*: any*/),
                              (v1/*: any*/),
                              (v0/*: any*/),
                              (v2/*: any*/),
                              (v3/*: any*/),
                              (v4/*: any*/),
                              (v7/*: any*/),
                              (v8/*: any*/),
                              (v9/*: any*/),
                              (v10/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v1/*: any*/),
                          (v0/*: any*/),
                          (v18/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v1/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              }
            ],
            "storageKey": "watchedLotConnection(first:100)"
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "b7f53790491aad4c167721d6fe4a7728",
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
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.auctionsLotStandingConnection.edges.node.lot": (v20/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v23/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.reserveStatus": {
          "enumValues": [
            "NoReserve",
            "ReserveMet",
            "ReserveNotMet"
          ],
          "nullable": false,
          "plural": false,
          "type": "AuctionsReserveStatus"
        },
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v24/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v26/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v27/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v27/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v30/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v19/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v22/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v19/*: any*/),
        "me.bidders.sale": (v29/*: any*/),
        "me.bidders.sale.coverImage": (v27/*: any*/),
        "me.bidders.sale.coverImage.url": (v22/*: any*/),
        "me.bidders.sale.endAt": (v22/*: any*/),
        "me.bidders.sale.href": (v22/*: any*/),
        "me.bidders.sale.id": (v19/*: any*/),
        "me.bidders.sale.internalID": (v19/*: any*/),
        "me.bidders.sale.liveStartAt": (v22/*: any*/),
        "me.bidders.sale.name": (v22/*: any*/),
        "me.bidders.sale.partner": (v30/*: any*/),
        "me.bidders.sale.partner.id": (v19/*: any*/),
        "me.bidders.sale.partner.name": (v22/*: any*/),
        "me.bidders.sale.registrationStatus": (v31/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v19/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v32/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v32/*: any*/),
        "me.bidders.sale.slug": (v19/*: any*/),
        "me.bidders.sale.status": (v22/*: any*/),
        "me.id": (v19/*: any*/),
        "me.identityVerified": (v32/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v19/*: any*/),
        "me.pendingIdentityVerification.internalID": (v19/*: any*/),
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
        "me.watchedLotConnection.edges.node.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.lot": (v20/*: any*/),
        "me.watchedLotConnection.edges.node.lot.bidCount": (v23/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v24/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v26/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artistNames": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image": (v27/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image.url": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.internalID": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.slug": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.internalID": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.position": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage": (v27/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.coverImage.url": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.endAt": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.href": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.internalID": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.liveStartAt": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.name": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner": (v30/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.partner.name": (v22/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus": (v31/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v32/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.slug": (v19/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.status": (v22/*: any*/)
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
