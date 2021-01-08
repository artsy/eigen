/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 39dd324d5d07a8e3ff9848646c095bb5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type BidFlowQueryVariables = {
    artworkID: string;
    saleID: string;
};
export type BidFlowQueryResponse = {
    readonly artwork: {
        readonly sale_artwork: {
            readonly " $fragmentRefs": FragmentRefs<"BidFlow_sale_artwork">;
        } | null;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"BidFlow_me">;
    } | null;
};
export type BidFlowQuery = {
    readonly response: BidFlowQueryResponse;
    readonly variables: BidFlowQueryVariables;
};



/*
query BidFlowQuery(
  $artworkID: String!
  $saleID: String!
) {
  artwork(id: $artworkID) {
    sale_artwork: saleArtwork(saleID: $saleID) {
      ...BidFlow_sale_artwork
      id
    }
    id
  }
  me {
    ...BidFlow_me
    id
  }
}

fragment BidFlow_me on Me {
  ...ConfirmBid_me
}

fragment BidFlow_sale_artwork on SaleArtwork {
  ...SelectMaxBid_sale_artwork
  ...ConfirmBid_sale_artwork
  ...BidResult_sale_artwork
}

fragment BidResult_sale_artwork on SaleArtwork {
  sale {
    liveStartAt
    endAt
    slug
    id
  }
}

fragment ConfirmBid_me on Me {
  has_qualified_credit_cards: hasQualifiedCreditCards
  bidders(saleID: $saleID) {
    id
  }
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  id
  internalID
  sale {
    slug
    live_start_at: liveStartAt
    end_at: endAt
    isBenefit
    partner {
      name
      id
    }
    id
  }
  artwork {
    slug
    title
    date
    artist_names: artistNames
    image {
      url(version: "small")
    }
    id
  }
  lot_label: lotLabel
  ...BidResult_sale_artwork
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  id
  increments(useMyMaxBid: true) {
    display
    cents
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkID"
  },
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "saleID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkID"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "saleID",
    "variableName": "saleID"
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
  "name": "slug",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "BidFlowQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": "sale_artwork",
            "args": (v2/*: any*/),
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "saleArtwork",
            "plural": false,
            "selections": [
              {
                "args": null,
                "kind": "FragmentSpread",
                "name": "BidFlow_sale_artwork"
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
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "BidFlow_me"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "BidFlowQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": "sale_artwork",
            "args": (v2/*: any*/),
            "concreteType": "SaleArtwork",
            "kind": "LinkedField",
            "name": "saleArtwork",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "useMyMaxBid",
                    "value": true
                  }
                ],
                "concreteType": "BidIncrementsFormatted",
                "kind": "LinkedField",
                "name": "increments",
                "plural": true,
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
                "storageKey": "increments(useMyMaxBid:true)"
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
                "concreteType": "Sale",
                "kind": "LinkedField",
                "name": "sale",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  {
                    "alias": "live_start_at",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "liveStartAt",
                    "storageKey": null
                  },
                  {
                    "alias": "end_at",
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "isBenefit",
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
                  (v3/*: any*/),
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "liveStartAt",
                    "storageKey": null
                  },
                  {
                    "alias": null,
                    "args": null,
                    "kind": "ScalarField",
                    "name": "endAt",
                    "storageKey": null
                  }
                ],
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
                  (v4/*: any*/),
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
                    "name": "date",
                    "storageKey": null
                  },
                  {
                    "alias": "artist_names",
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
                            "value": "small"
                          }
                        ],
                        "kind": "ScalarField",
                        "name": "url",
                        "storageKey": "url(version:\"small\")"
                      }
                    ],
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ],
                "storageKey": null
              },
              {
                "alias": "lot_label",
                "args": null,
                "kind": "ScalarField",
                "name": "lotLabel",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
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
            "alias": "has_qualified_credit_cards",
            "args": null,
            "kind": "ScalarField",
            "name": "hasQualifiedCreditCards",
            "storageKey": null
          },
          {
            "alias": null,
            "args": (v2/*: any*/),
            "concreteType": "Bidder",
            "kind": "LinkedField",
            "name": "bidders",
            "plural": true,
            "selections": [
              (v3/*: any*/)
            ],
            "storageKey": null
          },
          (v3/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "39dd324d5d07a8e3ff9848646c095bb5",
    "metadata": {},
    "name": "BidFlowQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd0fc36c2f7a45a3e35dead25f2fa9bf3';
export default node;
