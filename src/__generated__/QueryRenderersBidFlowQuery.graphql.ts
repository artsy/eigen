/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersBidFlowQueryVariables = {
    readonly artworkID: string;
    readonly saleID: string;
};
export type QueryRenderersBidFlowQueryResponse = {
    readonly artwork: ({
        readonly sale_artwork: ({
        }) | null;
    }) | null;
};



/*
query QueryRenderersBidFlowQuery(
  $artworkID: String!
  $saleID: String!
) {
  artwork(id: $artworkID) {
    sale_artwork(sale_id: $saleID) {
      ...BidFlow_sale_artwork
      __id
    }
    __id
  }
}

fragment BidFlow_sale_artwork on SaleArtwork {
  ...SelectMaxBid_sale_artwork
  __id
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments {
    display
    cents
  }
  ...ConfirmBid_sale_artwork
  __id
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  sale {
    id
    __id
  }
  artwork {
    id
    title
    date
    artist_names
    __id
  }
  lot_label
  ...BidResult_sale_artwork
  __id
}

fragment BidResult_sale_artwork on SaleArtwork {
  current_bid {
    amount
    cents
    display
  }
  __id
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
  "name": "__id",
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
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersBidFlowQuery",
<<<<<<< HEAD
  "id": "0a615ed0d3710d159ec8fc60f04c2de2",
=======
  "id": "a2c9a6aa101fb74640dd4454310c1f6e",
>>>>>>> display current bid
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersBidFlowQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale_artwork",
            "storageKey": null,
            "args": v2,
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "BidFlow_sale_artwork",
                "args": null
              },
              v3
            ]
          },
          v3
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersBidFlowQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "sale_artwork",
            "storageKey": null,
            "args": v2,
            "concreteType": "SaleArtwork",
            "plural": false,
            "selections": [
<<<<<<< HEAD
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "increments",
                "storageKey": null,
                "args": null,
                "concreteType": "BidIncrementsFormatted",
                "plural": true,
                "selections": [
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "display",
                    "args": null,
                    "storageKey": null
                  },
                  {
                    "kind": "ScalarField",
                    "alias": null,
                    "name": "cents",
                    "args": null,
                    "storageKey": null
                  }
                ]
              },
              {
                "kind": "LinkedField",
=======
              v3,
              v4
            ]
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
              v5,
              v2
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
              v5,
              {
                "kind": "ScalarField",
>>>>>>> display current bid
                "alias": null,
                "name": "sale",
                "storageKey": null,
                "args": null,
                "concreteType": "Sale",
                "plural": false,
                "selections": [
                  v4,
                  v3
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
                  v4,
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
                  },
                  v3
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "lot_label",
                "args": null,
                "storageKey": null
              },
              v3
            ]
          },
<<<<<<< HEAD
          v3
=======
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
            "name": "current_bid",
            "storageKey": null,
            "args": null,
            "concreteType": "SaleArtworkCurrentBid",
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "amount",
                "args": null,
                "storageKey": null
              },
              v4,
              v3
            ]
          },
          v2
>>>>>>> display current bid
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'd81a045733ed31854b43fa13be58de0c';
export default node;
