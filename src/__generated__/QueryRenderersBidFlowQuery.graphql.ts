/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { BidFlow_me$ref } from "./BidFlow_me.graphql";
import { BidFlow_sale_artwork$ref } from "./BidFlow_sale_artwork.graphql";
export type QueryRenderersBidFlowQueryVariables = {
    readonly artworkID: string;
    readonly saleID: string;
};
export type QueryRenderersBidFlowQueryResponse = {
    readonly artwork: ({
        readonly sale_artwork: ({
            readonly " $fragmentRefs": BidFlow_sale_artwork$ref;
        }) | null;
    }) | null;
    readonly me: ({
        readonly " $fragmentRefs": BidFlow_me$ref;
    }) | null;
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
    sale_artwork(sale_id: $saleID) {
      ...BidFlow_sale_artwork
    }
  }
  me {
    ...BidFlow_me
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
  has_qualified_credit_cards
  bidders(sale_id: $saleID) {
    qualified_for_bidding
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments(useMyMaxBid: true) {
    display
    cents
  }
  _id
  ...ConfirmBid_sale_artwork
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  _id
  sale {
    gravityID
    live_start_at
    end_at
  }
  artwork {
    gravityID
    title
    date
    artist_names
  }
  lot_label
  ...BidResult_sale_artwork
}

fragment BidResult_sale_artwork on SaleArtwork {
  minimum_next_bid {
    amount
    cents
    display
  }
  sale {
    live_start_at
    end_at
    gravityID
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
    "variableName": "artworkID",
    "type": "String!"
  }
],
v2 = [
  {
    "kind": "Variable",
    "name": "sale_id",
    "variableName": "saleID",
    "type": "String"
  }
],
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
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
            "alias": null,
            "name": "sale_artwork",
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
            "alias": null,
            "name": "sale_artwork",
            "storageKey": null,
            "args": (v2/*: any*/),
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": "increments(useMyMaxBid:true)",
                "args": [
                  {
                    "kind": "Literal",
                    "name": "useMyMaxBid",
                    "value": true,
                    "type": "Boolean"
                  }
                ],
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "_id",
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
                  (v5/*: any*/),
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "live_start_at",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "end_at",
                    "args": null,
                    "storageKey": null
                  }
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
                  (v5/*: any*/),
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
                    "alias": null,
                    "name": "artist_names",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "lot_label",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "minimum_next_bid",
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
                  (v4/*: any*/),
                  (v3/*: any*/)
                ]
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
            "kind": "ScalarField",
            "alias": null,
            "name": "has_qualified_credit_cards",
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
                "alias": null,
                "name": "qualified_for_bidding",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "QueryRenderersBidFlowQuery",
    "id": "2d8c3fea75a28bde19b0f42c870bd574",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2d8c3fea75a28bde19b0f42c870bd574';
export default node;
