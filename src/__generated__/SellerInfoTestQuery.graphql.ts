/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { SellerInfo_artwork$ref } from "./SellerInfo_artwork.graphql";
export type SellerInfoTestQueryVariables = {};
export type SellerInfoTestQueryResponse = {
    readonly artwork: ({
        readonly " $fragmentRefs": SellerInfo_artwork$ref;
    }) | null;
};
export type SellerInfoTestQuery = {
    readonly response: SellerInfoTestQueryResponse;
    readonly variables: SellerInfoTestQueryVariables;
};



/*
query SellerInfoTestQuery {
  artwork(id: "testArtwork") {
    ...SellerInfo_artwork
    __id
  }
}

fragment SellerInfo_artwork on Artwork {
  partner {
    __id
    id
    name
  }
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "testArtwork",
    "type": "String!"
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "SellerInfoTestQuery",
  "id": "862bc386eb0d3315e26007b41164b054",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "SellerInfoTestQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"testArtwork\")",
        "args": v0,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SellerInfo_artwork",
            "args": null
          },
          v1
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SellerInfoTestQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"testArtwork\")",
        "args": v0,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "partner",
            "storageKey": null,
            "args": null,
            "concreteType": "Partner",
            "plural": false,
            "selections": [
              v1,
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              }
            ]
          },
          v1
        ]
      }
    ]
  }
};
})();
(node as any).hash = '651703ef15b2b68c10cce9c39855b479';
export default node;
