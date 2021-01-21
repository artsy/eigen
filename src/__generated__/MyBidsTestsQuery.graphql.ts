/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fac0c0dca931bd0129831f7e91b11962 */

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
    lotLabel
    artwork {
      href
      artistNames
      image {
        url(version: "medium")
      }
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
v12 = [
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
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "bidCount",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "soldStatus",
  "storageKey": null
},
v15 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v16 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "sellingPrice",
  "plural": false,
  "selections": (v15/*: any*/),
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "lotLabel",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v19 = {
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
v20 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v21 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v22 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Boolean"
},
v23 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "AuctionsLotState"
},
v24 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
},
v25 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v26 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "Int"
},
v27 = {
  "enumValues": [
    "ForSale",
    "Passed",
    "Sold"
  ],
  "nullable": false,
  "plural": false,
  "type": "AuctionsSoldStatus"
},
v28 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtwork"
},
v29 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v30 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v31 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v32 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v33 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v34 = {
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
            "args": (v12/*: any*/),
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
                          (v13/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "reserveStatus",
                            "storageKey": null
                          },
                          (v14/*: any*/),
                          {
                            "alias": "askingPrice",
                            "args": null,
                            "concreteType": "Money",
                            "kind": "LinkedField",
                            "name": "onlineAskingPrice",
                            "plural": false,
                            "selections": (v15/*: any*/),
                            "storageKey": null
                          },
                          (v16/*: any*/),
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
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v18/*: any*/),
                              (v19/*: any*/),
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
            "args": (v12/*: any*/),
            "filters": null,
            "handle": "connection",
            "key": "MyBids_auctionsLotStandingConnection",
            "kind": "LinkedHandle",
            "name": "auctionsLotStandingConnection"
          },
          {
            "alias": null,
            "args": (v12/*: any*/),
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
                        "concreteType": "AuctionsLotState",
                        "kind": "LinkedField",
                        "name": "lot",
                        "plural": false,
                        "selections": [
                          (v0/*: any*/),
                          (v13/*: any*/),
                          (v16/*: any*/),
                          (v14/*: any*/),
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
                          (v17/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artwork",
                            "kind": "LinkedField",
                            "name": "artwork",
                            "plural": false,
                            "selections": [
                              (v2/*: any*/),
                              (v18/*: any*/),
                              (v19/*: any*/),
                              (v1/*: any*/)
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
                              (v6/*: any*/),
                              (v11/*: any*/),
                              (v1/*: any*/)
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
    "id": "fac0c0dca931bd0129831f7e91b11962",
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
        "me.auctionsLotStandingConnection.edges.cursor": (v20/*: any*/),
        "me.auctionsLotStandingConnection.edges.node": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsLotStanding"
        },
        "me.auctionsLotStandingConnection.edges.node.__typename": (v20/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.isHighestBidder": (v22/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot": (v23/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice": (v24/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.askingPrice.display": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.bidCount": (v26/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.internalID": (v21/*: any*/),
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
        "me.auctionsLotStandingConnection.edges.node.lot.saleId": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice": (v24/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.sellingPrice.display": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.lot.soldStatus": (v27/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork": (v28/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork": (v29/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.artistNames": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.href": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image": (v30/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.image.url": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.internalID": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.artwork.slug": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.lotLabel": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.position": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Float"
        },
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale": (v31/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage": (v30/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.coverImage.url": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.endAt": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.href": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.internalID": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.liveStartAt": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.name": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner": (v32/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.partner.name": (v25/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus": (v33/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.id": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.registrationStatus.qualifiedForBidding": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.requireIdentityVerification": (v34/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.slug": (v21/*: any*/),
        "me.auctionsLotStandingConnection.edges.node.saleArtwork.sale.status": (v25/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "AuctionsPageInfo"
        },
        "me.auctionsLotStandingConnection.pageInfo.endCursor": (v25/*: any*/),
        "me.auctionsLotStandingConnection.pageInfo.hasNextPage": (v22/*: any*/),
        "me.bidders": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Bidder"
        },
        "me.bidders.id": (v21/*: any*/),
        "me.bidders.sale": (v31/*: any*/),
        "me.bidders.sale.coverImage": (v30/*: any*/),
        "me.bidders.sale.coverImage.url": (v25/*: any*/),
        "me.bidders.sale.endAt": (v25/*: any*/),
        "me.bidders.sale.href": (v25/*: any*/),
        "me.bidders.sale.id": (v21/*: any*/),
        "me.bidders.sale.internalID": (v21/*: any*/),
        "me.bidders.sale.liveStartAt": (v25/*: any*/),
        "me.bidders.sale.name": (v25/*: any*/),
        "me.bidders.sale.partner": (v32/*: any*/),
        "me.bidders.sale.partner.id": (v21/*: any*/),
        "me.bidders.sale.partner.name": (v25/*: any*/),
        "me.bidders.sale.registrationStatus": (v33/*: any*/),
        "me.bidders.sale.registrationStatus.id": (v21/*: any*/),
        "me.bidders.sale.registrationStatus.qualifiedForBidding": (v34/*: any*/),
        "me.bidders.sale.requireIdentityVerification": (v34/*: any*/),
        "me.bidders.sale.slug": (v21/*: any*/),
        "me.bidders.sale.status": (v25/*: any*/),
        "me.id": (v21/*: any*/),
        "me.identityVerified": (v34/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v21/*: any*/),
        "me.pendingIdentityVerification.internalID": (v21/*: any*/),
        "me.watchedLotConnection": {
          "enumValues": null,
          "nullable": false,
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
        "me.watchedLotConnection.edges.node.internalID": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.lot": (v23/*: any*/),
        "me.watchedLotConnection.edges.node.lot.bidCount": (v26/*: any*/),
        "me.watchedLotConnection.edges.node.lot.id": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.lot.internalID": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice": (v24/*: any*/),
        "me.watchedLotConnection.edges.node.lot.sellingPrice.display": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.lot.soldStatus": (v27/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork": (v28/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork": (v29/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.artistNames": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.href": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.id": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image": (v30/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.artwork.image.url": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.id": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.lotLabel": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale": (v31/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.endAt": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.id": (v21/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.liveStartAt": (v25/*: any*/),
        "me.watchedLotConnection.edges.node.saleArtwork.sale.status": (v25/*: any*/)
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
