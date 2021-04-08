/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 682122965b07d18eef71da69a509f106 */

import { ConcreteRequest } from "relay-runtime";
export type CommerceOrderStateEnum = "ABANDONED" | "APPROVED" | "CANCELED" | "FULFILLED" | "PENDING" | "REFUNDED" | "SUBMITTED" | "%future added value";
export type ReviewOfferButtonTestsQueryVariables = {
    orderID: string;
};
export type ReviewOfferButtonTestsQueryResponse = {
    readonly order: {
        readonly state: CommerceOrderStateEnum;
    } | null;
};
export type ReviewOfferButtonTestsQuery = {
    readonly response: ReviewOfferButtonTestsQueryResponse;
    readonly variables: ReviewOfferButtonTestsQueryVariables;
};



/*
query ReviewOfferButtonTestsQuery(
  $orderID: ID!
) {
  order: commerceOrder(id: $orderID) {
    __typename
    state
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
  "name": "state",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ReviewOfferButtonTestsQuery",
    "selections": [
      {
        "alias": "order",
        "args": (v1/*: any*/),
        "concreteType": null,
        "kind": "LinkedField",
        "name": "commerceOrder",
        "plural": false,
        "selections": [
          (v2/*: any*/)
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
    "name": "ReviewOfferButtonTestsQuery",
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
          (v2/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "682122965b07d18eef71da69a509f106",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "order": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "CommerceOrder"
        },
        "order.__typename": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "String"
        },
        "order.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "order.state": {
          "enumValues": [
            "ABANDONED",
            "APPROVED",
            "CANCELED",
            "FULFILLED",
            "PENDING",
            "REFUNDED",
            "SUBMITTED"
          ],
          "nullable": false,
          "plural": false,
          "type": "CommerceOrderStateEnum"
        }
      }
    },
    "name": "ReviewOfferButtonTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'c48a04d8dee3e3aebff5632e39f1d040';
export default node;
