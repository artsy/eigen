/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 882e163d1633447ba59fc3a4f953e9c5 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OrderDetailsPaymentTestsQueryVariables = {
    orderID: string;
};
export type OrderDetailsPaymentTestsQueryResponse = {
    readonly order: {
        readonly " $fragmentRefs": FragmentRefs<"OrderDetailsPayment_order">;
    } | null;
};
export type OrderDetailsPaymentTestsQuery = {
    readonly response: OrderDetailsPaymentTestsQueryResponse;
    readonly variables: OrderDetailsPaymentTestsQueryVariables;
};



/*
query OrderDetailsPaymentTestsQuery(
  $orderID: ID!
) {
  order: commerceOrder(id: $orderID) {
    __typename
    ...OrderDetailsPayment_order
    id
  }
}

fragment OrderDetailsPayment_order on CommerceOrder {
  __isCommerceOrder: __typename
  creditCard {
    brand
    lastDigits
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "orderID"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "orderID"
  }
],
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "String"
},
v4 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "OrderDetailsPaymentTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "OrderDetailsPayment_order"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "OrderDetailsPaymentTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "__typename",
            "storageKey": null
          },
          {
            "kind": "TypeDiscriminator",
            "abstractKey": "__isCommerceOrder"
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "CreditCard",
            "kind": "LinkedField",
            "name": "creditCard",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "brand",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "lastDigits",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          },
          (v2/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "882e163d1633447ba59fc3a4f953e9c5",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "order": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "order.__isCommerceOrder": (v3/*: any*/),
        "order.__typename": (v3/*: any*/),
        "order.creditCard": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CreditCard"
        },
        "order.creditCard.brand": (v3/*: any*/),
        "order.creditCard.id": (v4/*: any*/),
        "order.creditCard.lastDigits": (v3/*: any*/),
        "order.id": (v4/*: any*/)
      }
    },
    "name": "OrderDetailsPaymentTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '0de2387420be95c6559b4a18e810945d';
export default node;
