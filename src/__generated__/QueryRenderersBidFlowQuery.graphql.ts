/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { BidFlow_me$ref } from "./BidFlow_me.graphql";
import { BidFlow_sale_artwork$ref } from "./BidFlow_sale_artwork.graphql";
export type QueryRenderersBidFlowQueryVariables = {
    readonly artworkID: string;
    readonly saleID: string;
};
export type QueryRenderersBidFlowQueryResponse = {
    readonly artwork: {
        readonly sale_artwork: {
            readonly " $fragmentRefs": BidFlow_sale_artwork$ref;
        } | null;
    } | null;
    readonly me: {
        readonly " $fragmentRefs": BidFlow_me$ref;
    } | null;
};
export type QueryRenderersBidFlowQuery = {
    readonly response: QueryRenderersBidFlowQueryResponse;
    readonly variables: QueryRenderersBidFlowQueryVariables;
};



/*
query QueryRenderersBidFlowQuery(
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

fragment BidFlow_sale_artwork on SaleArtwork {
  ...SelectMaxBid_sale_artwork
}

fragment BidFlow_me on Me {
  ...SelectMaxBid_me
}

fragment SelectMaxBid_me on Me {
  ...ConfirmBid_me
}

fragment ConfirmBid_me on Me {
  has_qualified_credit_cards: hasQualifiedCreditCards
  bidders(saleID: $saleID) {
    qualified_for_bidding: qualifiedForBidding
    id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  id
  increments(useMyMaxBid: true) {
    display
    cents
  }
  ...ConfirmBid_sale_artwork
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  internalID
  sale {
    slug
    live_start_at: liveStartAt
    end_at: endAt
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

fragment BidResult_sale_artwork on SaleArtwork {
  minimum_next_bid: minimumNextBid {
    amount
    cents
    display
  }
  sale {
    live_start_at: liveStartAt
    end_at: endAt
    slug
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "artworkID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "saleID",
    "type": "String!",
    "defaultValue": null
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
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersBidFlowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "sale_artwork",
            "name": "saleArtwork",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "BidFlow_sale_artwork",
                "args": null
              }
            ]
          }
        ]
      },
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
            "name": "BidFlow_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersBidFlowQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": "sale_artwork",
            "name": "saleArtwork",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": "increments(useMyMaxBid:true)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "useMyMaxBid",
                    "value": true
                  }
                ],
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "internalID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "sale",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
                "plural": false,
                "selections": [
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": "live_start_at",
                    "name": "liveStartAt",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": "end_at",
                    "name": "endAt",
                    "args": null,
                    "storageKey": null
                  },
                  (v3/*: any*/)
                ]
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
                  (v6/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "title",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "date",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": "artist_names",
                    "name": "artistNames",
                    "args": null,
                    "storageKey": null
                  },
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
                            "value": "small"
                          }
                        ],
                        "storageKey": "url(version:\"small\")"
                      }
                    ]
                  },
                  (v3/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": "lot_label",
                "name": "lotLabel",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": "minimum_next_bid",
                "name": "minimumNextBid",
                "storageKey": null,
                "args": null,
                "concreteType": "SaleArtworkMinimumNextBid",
                "plural": false,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "amount",
                    "args": null,
                    "storageKey": null
                  },
                  (v5/*: any*/),
                  (v4/*: any*/)
                ]
              }
            ]
          },
          (v3/*: any*/)
        ]
      },
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
            "kind": "ScalarField",
            "alias": "has_qualified_credit_cards",
            "name": "hasQualifiedCreditCards",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "bidders",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "Bidder",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "qualified_for_bidding",
                "name": "qualifiedForBidding",
                "args": null,
                "storageKey": null
              },
              (v3/*: any*/)
            ]
          },
          (v3/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersBidFlowQuery",
    "id": "b15d66d6742139d778366cabf951be30",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3ec3ffc863425fc2bd60a4aed520770d';
export default node;
