/* tslint:disable */
/* eslint-disable */
/* @relayHash 411c2cf9c60d198a54cd921691d3e206 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountQueryVariables = {};
export type MyAccountQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyAccount_me">;
    } | null;
};
export type MyAccountQuery = {
    readonly response: MyAccountQueryResponse;
    readonly variables: MyAccountQueryVariables;
};



/*
query MyAccountQuery {
  me {
    ...MyAccount_me
    id
  }
}

fragment MyAccount_me on Me {
  name
  email
  phone
  paddleNumber
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyAccount_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyAccountQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
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
            "name": "email",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "phone",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "paddleNumber",
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
    "name": "MyAccountQuery",
    "id": "5a3eeba6eebcf07209f7954d79cfddac",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '8f5885fed0c1869833b4ad7966725076';
export default node;
