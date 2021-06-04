/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7625a13d2478d82ccb7152e6db65236d */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderDetailsHeaderTestsQueryVariables = {};
export type OrderDetailsHeaderTestsQueryResponse = {
    readonly commerceOrder: {
        readonly " $fragmentRefs": FragmentRefs<"OrderDetailsHeader_info">;
    } | null;
};
export type OrderDetailsHeaderTestsQuery = {
    readonly response: OrderDetailsHeaderTestsQueryResponse;
    readonly variables: OrderDetailsHeaderTestsQueryVariables;
};



/*
query OrderDetailsHeaderTestsQuery {
  commerceOrder(id: "some-id") {
    __typename
    ...OrderDetailsHeader_info
    id
  }
}

fragment OrderDetailsHeader_info on CommerceOrder {
  __isCommerceOrder: __typename
  createdAt
  requestedFulfillment {
    __typename
    ... on CommerceShip {
      __typename
    }
    ... on CommercePickup {
      __typename
    }
  }
  code
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-id"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "__typename",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "OrderDetailsHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrderDetailsHeader_info"
          }
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "OrderDetailsHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "requestedFulfillment",
            "plural": false,
            "selections": [
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "code",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "commerceOrder(id:\"some-id\")"
      }
    ]
  },
  "params": {
    "id": "7625a13d2478d82ccb7152e6db65236d",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "commerceOrder": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "commerceOrder.__isCommerceOrder": (v2/*: any*/),
        "commerceOrder.__typename": (v2/*: any*/),
        "commerceOrder.code": (v2/*: any*/),
        "commerceOrder.createdAt": (v2/*: any*/),
        "commerceOrder.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "commerceOrder.requestedFulfillment": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceRequestedFulfillmentUnion"
        },
        "commerceOrder.requestedFulfillment.__typename": (v2/*: any*/)
      }
    },
    "name": "OrderDetailsHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f4be98449e97d0493bd25cd35c371e62';
export default node;
