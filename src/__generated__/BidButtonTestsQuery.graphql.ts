/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4e56442e91b7dae53dbb45ffc5bf52cd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidButtonTestsQueryVariables = {};
export type BidButtonTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"BidButton_artwork">;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"BidButton_me">;
    } | null;
};
export type BidButtonTestsQueryRawResponse = {
    readonly artwork: ({
        readonly slug: string;
        readonly sale: ({
            readonly slug: string;
            readonly registrationStatus: ({
                readonly qualifiedForBidding: boolean | null;
                readonly id: string;
            }) | null;
            readonly isPreview: boolean | null;
            readonly isLiveOpen: boolean | null;
            readonly isClosed: boolean | null;
            readonly isRegistrationClosed: boolean | null;
            readonly requireIdentityVerification: boolean | null;
            readonly id: string;
        }) | null;
        readonly myLotStanding: ReadonlyArray<{
            readonly mostRecentBid: ({
                readonly maxBid: ({
                    readonly cents: number | null;
                }) | null;
                readonly id: string;
            }) | null;
        }> | null;
        readonly saleArtwork: ({
            readonly increments: ReadonlyArray<({
                readonly cents: number | null;
            }) | null> | null;
            readonly id: string;
        }) | null;
        readonly id: string;
    }) | null;
    readonly me: ({
        readonly identityVerified: boolean | null;
        readonly id: string;
    }) | null;
};
export type BidButtonTestsQuery = {
    readonly response: BidButtonTestsQueryResponse;
    readonly variables: BidButtonTestsQueryVariables;
    readonly rawResponse: BidButtonTestsQueryRawResponse;
};



/*
query BidButtonTestsQuery {
  artwork(id: "auction_artwork") {
    ...BidButton_artwork
    id
  }
  me {
    ...BidButton_me
    id
  }
}

fragment BidButton_artwork on Artwork {
  slug
  sale {
    slug
    registrationStatus {
      qualifiedForBidding
      id
    }
    isPreview
    isLiveOpen
    isClosed
    isRegistrationClosed
    requireIdentityVerification
    id
  }
  myLotStanding(live: true) {
    mostRecentBid {
      maxBid {
        cents
      }
      id
    }
  }
  saleArtwork {
    increments {
      cents
    }
    id
  }
}

fragment BidButton_me on Me {
  identityVerified
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "auction_artwork"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = [
  {
    "alias": null,
    "args": null,
    "kind": "ScalarField",
    "name": "cents",
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "BidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "BidButton_artwork"
          }
        ],
        "storageKey": "artwork(id:\"auction_artwork\")"
      },
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
            "name": "BidButton_me"
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
    "name": "BidButtonTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "concreteType": "Sale",
            "kind": "LinkedField",
            "name": "sale",
            "plural": false,
            "selections": [
              (v1/*: any*/),
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
                  (v2/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isPreview",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isLiveOpen",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isClosed",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isRegistrationClosed",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "requireIdentityVerification",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": [
              {
                "kind": "Literal",
                "name": "live",
                "value": true
              }
            ],
            "concreteType": "LotStanding",
            "kind": "LinkedField",
            "name": "myLotStanding",
            "plural": true,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BidderPosition",
                "kind": "LinkedField",
                "name": "mostRecentBid",
                "plural": false,
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "BidderPositionMaxBid",
                    "kind": "LinkedField",
                    "name": "maxBid",
                    "plural": false,
                    "selections": (v3/*: any*/),
                    "storageKey": null
                  },
                  (v2/*: any*/)
                ],
                "storageKey": null
              }
            ],
            "storageKey": "myLotStanding(live:true)"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "saleArtwork",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "concreteType": "BidIncrementsFormatted",
                "kind": "LinkedField",
                "name": "increments",
                "plural": true,
                "selections": (v3/*: any*/),
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": "artwork(id:\"auction_artwork\")"
      },
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
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4e56442e91b7dae53dbb45ffc5bf52cd",
    "metadata": {},
    "name": "BidButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '505afd431c2e9bde73b4098d823cc4a1';
export default node;
