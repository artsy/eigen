/* tslint:disable */
/* eslint-disable */
/* @relayHash d77d611949a02d96f4875178d5de744f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SaleInfoQueryRendererQueryVariables = {
    saleID: string;
};
export type SaleInfoQueryRendererQueryResponse = {
    readonly sale: {
        readonly " $fragmentRefs": FragmentRefs<"SaleInfo_sale">;
    } | null;
};
export type SaleInfoQueryRendererQuery = {
    readonly response: SaleInfoQueryRendererQueryResponse;
    readonly variables: SaleInfoQueryRendererQueryVariables;
};



/*
query SaleInfoQueryRendererQuery(
  $saleID: String!
) {
  sale(id: $saleID) {
    ...SaleInfo_sale
    id
  }
}

fragment SaleInfo_sale on Sale {
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
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
    "variableName": "saleID"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "SaleInfoQueryRendererQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "SaleInfo_sale",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "SaleInfoQueryRendererQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "sale",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "Sale",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "name",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "SaleInfoQueryRendererQuery",
    "id": "f5c6d1f86ba305588f8efd13695d8b0b",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '705443c77e0e8bdaf1798681fffa7ba2';
export default node;
