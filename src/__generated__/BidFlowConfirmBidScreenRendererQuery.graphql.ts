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
    ...ConfirmBid_sale_artwork
    __id
  }
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
  "id": "4e1f63820a703d4d9ba62de14cbc9c83",
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
          },
          v2
        ]
      }
    ]
  }
};
})();
(node as any).hash = '4b3def96e7917ce25eac8990cae528a0';
export default node;
