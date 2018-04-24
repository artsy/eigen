/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type BidFlowConfirmBidScreenRendererQueryVariables = {
    readonly saleArtworkID: string;
};
export type BidFlowConfirmBidScreenRendererQueryResponse = {
    readonly sale_artwork: ({
    }) | null;
};



/*
query BidFlowConfirmBidScreenRendererQuery(
  $saleArtworkID: String!
) {
  sale_artwork(id: $saleArtworkID) {
    ...SelectMaxBid_sale_artwork
    ...ConfirmBid_sale_artwork
    __id
  }
}

fragment SelectMaxBid_sale_artwork on SaleArtwork {
  increments {
    display
    cents
  }
  __id
}

fragment ConfirmBid_sale_artwork on SaleArtwork {
  artwork {
    title
    date
    artist_names
    __id
  }
  lot_label
  __id
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
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "BidFlowConfirmBidScreenRendererQuery",
  "id": "129c7b7d77ed03cc490c83ec9fe6f9f3",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "BidFlowConfirmBidScreenRendererQuery",
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
          {
            "kind": "FragmentSpread",
            "name": "ConfirmBid_sale_artwork",
            "args": null
          },
          v2
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "BidFlowConfirmBidScreenRendererQuery",
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
          v2,
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artwork",
            "storageKey": null,
            "args": null,
            "concreteType": "Artwork",
            "plural": false,
            "selections": [
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
          }
        ]
      }
    ]
  }
};
})();
(node as any).hash = 'ccdd01ad0ba581723c2a9e35a68181dd';
export default node;
