/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SelectMaxBid_sale_artwork$ref } from "./SelectMaxBid_sale_artwork.graphql";
export type BidFlowSelectMaxBidRendererQueryVariables = {
    readonly saleArtworkID: string;
};
export type BidFlowSelectMaxBidRendererQueryResponse = {
    readonly sale_artwork: ({
        readonly " $fragmentRefs": SelectMaxBid_sale_artwork$ref;
    }) | null;
};
export type BidFlowSelectMaxBidRendererQuery = {
    readonly response: BidFlowSelectMaxBidRendererQueryResponse;
    readonly variables: BidFlowSelectMaxBidRendererQueryVariables;
};



/*
query BidFlowSelectMaxBidRendererQuery(
  $saleArtworkID: String!
) {
  sale_artwork(id: $saleArtworkID) {
    ...SelectMaxBid_sale_artwork
    __id: id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments(useMyMaxBid: true) {
    display
    cents
  }
  internalID
  ...ConfirmBid_sale_artwork
  __id: id
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  internalID
  sale {
    gravityID
    live_start_at
    end_at
    __id: id
  }
  artwork {
    gravityID
    title
    date
    artist_names
    __id: id
  }
  lot_label
  ...BidResult_sale_artwork
  __id: id
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
    __id: id
  }
  __id: id
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
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
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
  "operationKind": "query",
  "name": "BidFlowSelectMaxBidRendererQuery",
  "id": null,
  "text": "query BidFlowSelectMaxBidRendererQuery(\n  $saleArtworkID: String!\n) {\n  sale_artwork(id: $saleArtworkID) {\n    ...SelectMaxBid_sale_artwork\n    __id: id\n  }\n}\n\nfragment SelectMaxBid_sale_artwork on SaleArtwork {\n  increments(useMyMaxBid: true) {\n    display\n    cents\n  }\n  internalID\n  ...ConfirmBid_sale_artwork\n  __id: id\n}\n\nfragment ConfirmBid_sale_artwork on SaleArtwork {\n  internalID\n  sale {\n    gravityID\n    live_start_at\n    end_at\n    __id: id\n  }\n  artwork {\n    gravityID\n    title\n    date\n    artist_names\n    __id: id\n  }\n  lot_label\n  ...BidResult_sale_artwork\n  __id: id\n}\n\nfragment BidResult_sale_artwork on SaleArtwork {\n  minimum_next_bid {\n    amount\n    cents\n    display\n  }\n  sale {\n    live_start_at\n    end_at\n    gravityID\n    __id: id\n  }\n  __id: id\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": v1,
        "concreteType": "SaleArtwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SelectMaxBid_sale_artwork",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "BidFlowSelectMaxBidRendererQuery",
    "argumentDefinitions": v0,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale_artwork",
        "storageKey": null,
        "args": v1,
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
              v3,
              v4
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
              v5,
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
              v2
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
              v4,
              v3
            ]
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'dcde3e88d982c125ae7d58799e69d88e';
export default node;
