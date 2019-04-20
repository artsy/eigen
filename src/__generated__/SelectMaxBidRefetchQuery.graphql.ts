/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SelectMaxBid_sale_artwork$ref } from "./SelectMaxBid_sale_artwork.graphql";
export type SelectMaxBidRefetchQueryVariables = {
    readonly saleArtworkID: string;
};
export type SelectMaxBidRefetchQueryResponse = {
    readonly sale_artwork: ({
        readonly " $fragmentRefs": SelectMaxBid_sale_artwork$ref;
    }) | null;
};
export type SelectMaxBidRefetchQuery = {
    readonly response: SelectMaxBidRefetchQueryResponse;
    readonly variables: SelectMaxBidRefetchQueryVariables;
};



/*
query SelectMaxBidRefetchQuery(
  $saleArtworkID: String!
) {
  sale_artwork(id: $saleArtworkID) {
    ...SelectMaxBid_sale_artwork
    id
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
    id
  }
  artwork {
    gravityID
    title
    date
    artist_names
    id
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
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "saleArtworkID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "saleArtworkID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "display",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cents",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
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
  "fragment": {
    "kind": "Fragment",
    "name": "SelectMaxBidRefetchQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SelectMaxBid_sale_artwork",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SelectMaxBidRefetchQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/)
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
              (v4/*: any*/),
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
              },
              (v5/*: any*/)
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
              (v4/*: any*/),
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
              (v5/*: any*/)
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
              (v3/*: any*/),
              (v2/*: any*/)
            ]
          },
          (v5/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SelectMaxBidRefetchQuery",
    "id": "30414b397c1503132689a2120424e8b2",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '30414b397c1503132689a2120424e8b2';
export default node;
