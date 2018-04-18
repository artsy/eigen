/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersBidQueryVariables = {
    readonly saleArtworkID: string;
};
export type QueryRenderersBidQueryResponse = {
    readonly sale_artwork: ({
        readonly id: string;
        readonly bid_increments: ReadonlyArray<number | null> | null;
    }) | null;
};



/*
query QueryRenderersBidQuery(
  $saleArtworkID: String!
) {
  sale_artwork(id: $saleArtworkID) {
    id
    bid_increments
    __id
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
    "kind": "LinkedField",
    "alias": null,
    "name": "sale_artwork",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "saleArtworkID",
        "type": "String!"
      }
    ],
    "concreteType": "SaleArtwork",
    "plural": false,
    "selections": [
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
        "name": "bid_increments",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "__id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersBidQuery",
  "id": "642b6bc565585ce3d6401ea15d821149",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersBidQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersBidQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = 'b18369052e62e9d14feed2b575ef44cb';
export default node;
