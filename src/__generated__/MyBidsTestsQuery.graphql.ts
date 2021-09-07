/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5cd0d822f0117f18f8e9f00724ab9a1a */

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

fragment ActiveLotStanding_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  isHighestBidder
  sale {
    status
    liveStartAt
    endAt
    id
  }
  lotState {
    bidCount
    reserveStatus
    soldStatus
    sellingPrice {
      display
    }
  }
  artwork {
    internalID
    href
    slug
    id
  }
  currentBid {
    display
  }
  estimate
}

fragment ClosedLotStanding_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  isHighestBidder
  estimate
  artwork {
    internalID
    href
    slug
    id
  }
  lotState {
    soldStatus
    sellingPrice {
      display
    }
  }
  sale {
    endAt
    status
    id
  }
}

fragment LotStatusListItem_saleArtwork on SaleArtwork {
  ...ClosedLotStanding_saleArtwork
  ...ActiveLotStanding_saleArtwork
  ...WatchedLot_saleArtwork
  isWatching
  lotState {
    soldStatus
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
  myBids {
    active {
      sale {
        ...SaleCard_sale
        internalID
        registrationStatus {
          qualifiedForBidding
          id
        }
        id
      }
      saleArtworks {
        ...LotStatusListItem_saleArtwork
        internalID
        id
      }
    }
    closed {
      sale {
        ...SaleCard_sale
        internalID
        registrationStatus {
          qualifiedForBidding
          id
        }
        id
      }
      saleArtworks {
        ...LotStatusListItem_saleArtwork
        internalID
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

fragment WatchedLot_saleArtwork on SaleArtwork {
  ...Lot_saleArtwork
  lotState {
    bidCount
    sellingPrice {
      display
    }
  }
  artwork {
    internalID
    href
    slug
    id
  }
  currentBid {
    display
  }
  estimate
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
v7 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "display",
    "storageKey": null
  }
],
v8 = [
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
      {
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
      {
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
      {
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
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "requireIdentityVerification",
        "storageKey": null
      },
      (v1/*: any*/)
    ],
    "storageKey": null
  },
  {
    "alias": null,
    "args": null,
    "concreteType": "SaleArtwork",
    "kind": "LinkedField",
    "name": "saleArtworks",
    "plural": true,
    "selections": [
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "lotLabel",
        "storageKey": null
      },
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
        "kind": "ScalarField",
        "name": "isHighestBidder",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "estimate",
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "CausalityLotState",
        "kind": "LinkedField",
        "name": "lotState",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "soldStatus",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Money",
            "kind": "LinkedField",
            "name": "sellingPrice",
            "plural": false,
            "selections": (v7/*: any*/),
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bidCount",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "reserveStatus",
            "storageKey": null
          }
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
          (v6/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "status",
            "storageKey": null
          },
          (v1/*: any*/),
          (v5/*: any*/)
        ],
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "concreteType": "SaleArtworkCurrentBid",
        "kind": "LinkedField",
        "name": "currentBid",
        "plural": false,
        "selections": (v7/*: any*/),
        "storageKey": null
      },
      {
        "alias": null,
        "args": null,
        "kind": "ScalarField",
        "name": "isWatching",
        "storageKey": null
      },
      (v0/*: any*/),
      (v1/*: any*/)
    ],
    "storageKey": null
  }
],
v9 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v10 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Boolean"
},
v11 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "MyBid"
},
v12 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Sale"
},
v13 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Image"
},
v14 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v15 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Partner"
},
v16 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Bidder"
},
v17 = {
  "enumValues": null,
  "nullable": true,
  "plural": true,
  "type": "SaleArtwork"
},
v18 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Artwork"
},
v19 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "SaleArtworkCurrentBid"
},
v20 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "CausalityLotState"
},
v21 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
},
v22 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Money"
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
            "args": null,
            "concreteType": "MyBids",
            "kind": "LinkedField",
            "name": "myBids",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "MyBid",
                "kind": "LinkedField",
                "name": "active",
                "plural": true,
                "selections": (v8/*: any*/),
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "MyBid",
                "kind": "LinkedField",
                "name": "closed",
                "plural": true,
                "selections": (v8/*: any*/),
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v1/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "5cd0d822f0117f18f8e9f00724ab9a1a",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v9/*: any*/),
        "me.identityVerified": (v10/*: any*/),
        "me.myBids": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyBids"
        },
        "me.myBids.active": (v11/*: any*/),
        "me.myBids.active.sale": (v12/*: any*/),
        "me.myBids.active.sale.coverImage": (v13/*: any*/),
        "me.myBids.active.sale.coverImage.url": (v14/*: any*/),
        "me.myBids.active.sale.endAt": (v14/*: any*/),
        "me.myBids.active.sale.href": (v14/*: any*/),
        "me.myBids.active.sale.id": (v9/*: any*/),
        "me.myBids.active.sale.internalID": (v9/*: any*/),
        "me.myBids.active.sale.liveStartAt": (v14/*: any*/),
        "me.myBids.active.sale.name": (v14/*: any*/),
        "me.myBids.active.sale.partner": (v15/*: any*/),
        "me.myBids.active.sale.partner.id": (v9/*: any*/),
        "me.myBids.active.sale.partner.name": (v14/*: any*/),
        "me.myBids.active.sale.registrationStatus": (v16/*: any*/),
        "me.myBids.active.sale.registrationStatus.id": (v9/*: any*/),
        "me.myBids.active.sale.registrationStatus.qualifiedForBidding": (v10/*: any*/),
        "me.myBids.active.sale.requireIdentityVerification": (v10/*: any*/),
        "me.myBids.active.sale.slug": (v9/*: any*/),
        "me.myBids.active.saleArtworks": (v17/*: any*/),
        "me.myBids.active.saleArtworks.artwork": (v18/*: any*/),
        "me.myBids.active.saleArtworks.artwork.artistNames": (v14/*: any*/),
        "me.myBids.active.saleArtworks.artwork.href": (v14/*: any*/),
        "me.myBids.active.saleArtworks.artwork.id": (v9/*: any*/),
        "me.myBids.active.saleArtworks.artwork.image": (v13/*: any*/),
        "me.myBids.active.saleArtworks.artwork.image.url": (v14/*: any*/),
        "me.myBids.active.saleArtworks.artwork.internalID": (v9/*: any*/),
        "me.myBids.active.saleArtworks.artwork.slug": (v9/*: any*/),
        "me.myBids.active.saleArtworks.currentBid": (v19/*: any*/),
        "me.myBids.active.saleArtworks.currentBid.display": (v14/*: any*/),
        "me.myBids.active.saleArtworks.estimate": (v14/*: any*/),
        "me.myBids.active.saleArtworks.id": (v9/*: any*/),
        "me.myBids.active.saleArtworks.internalID": (v9/*: any*/),
        "me.myBids.active.saleArtworks.isHighestBidder": (v10/*: any*/),
        "me.myBids.active.saleArtworks.isWatching": (v10/*: any*/),
        "me.myBids.active.saleArtworks.lotLabel": (v14/*: any*/),
        "me.myBids.active.saleArtworks.lotState": (v20/*: any*/),
        "me.myBids.active.saleArtworks.lotState.bidCount": (v21/*: any*/),
        "me.myBids.active.saleArtworks.lotState.reserveStatus": (v14/*: any*/),
        "me.myBids.active.saleArtworks.lotState.sellingPrice": (v22/*: any*/),
        "me.myBids.active.saleArtworks.lotState.sellingPrice.display": (v14/*: any*/),
        "me.myBids.active.saleArtworks.lotState.soldStatus": (v14/*: any*/),
        "me.myBids.active.saleArtworks.sale": (v12/*: any*/),
        "me.myBids.active.saleArtworks.sale.endAt": (v14/*: any*/),
        "me.myBids.active.saleArtworks.sale.id": (v9/*: any*/),
        "me.myBids.active.saleArtworks.sale.liveStartAt": (v14/*: any*/),
        "me.myBids.active.saleArtworks.sale.status": (v14/*: any*/),
        "me.myBids.closed": (v11/*: any*/),
        "me.myBids.closed.sale": (v12/*: any*/),
        "me.myBids.closed.sale.coverImage": (v13/*: any*/),
        "me.myBids.closed.sale.coverImage.url": (v14/*: any*/),
        "me.myBids.closed.sale.endAt": (v14/*: any*/),
        "me.myBids.closed.sale.href": (v14/*: any*/),
        "me.myBids.closed.sale.id": (v9/*: any*/),
        "me.myBids.closed.sale.internalID": (v9/*: any*/),
        "me.myBids.closed.sale.liveStartAt": (v14/*: any*/),
        "me.myBids.closed.sale.name": (v14/*: any*/),
        "me.myBids.closed.sale.partner": (v15/*: any*/),
        "me.myBids.closed.sale.partner.id": (v9/*: any*/),
        "me.myBids.closed.sale.partner.name": (v14/*: any*/),
        "me.myBids.closed.sale.registrationStatus": (v16/*: any*/),
        "me.myBids.closed.sale.registrationStatus.id": (v9/*: any*/),
        "me.myBids.closed.sale.registrationStatus.qualifiedForBidding": (v10/*: any*/),
        "me.myBids.closed.sale.requireIdentityVerification": (v10/*: any*/),
        "me.myBids.closed.sale.slug": (v9/*: any*/),
        "me.myBids.closed.saleArtworks": (v17/*: any*/),
        "me.myBids.closed.saleArtworks.artwork": (v18/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.artistNames": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.href": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.id": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.image": (v13/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.image.url": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.internalID": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.artwork.slug": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.currentBid": (v19/*: any*/),
        "me.myBids.closed.saleArtworks.currentBid.display": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.estimate": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.id": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.internalID": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.isHighestBidder": (v10/*: any*/),
        "me.myBids.closed.saleArtworks.isWatching": (v10/*: any*/),
        "me.myBids.closed.saleArtworks.lotLabel": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.lotState": (v20/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.bidCount": (v21/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.reserveStatus": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.sellingPrice": (v22/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.sellingPrice.display": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.lotState.soldStatus": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.sale": (v12/*: any*/),
        "me.myBids.closed.saleArtworks.sale.endAt": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.sale.id": (v9/*: any*/),
        "me.myBids.closed.saleArtworks.sale.liveStartAt": (v14/*: any*/),
        "me.myBids.closed.saleArtworks.sale.status": (v14/*: any*/),
        "me.pendingIdentityVerification": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "IdentityVerification"
        },
        "me.pendingIdentityVerification.id": (v9/*: any*/),
        "me.pendingIdentityVerification.internalID": (v9/*: any*/)
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
