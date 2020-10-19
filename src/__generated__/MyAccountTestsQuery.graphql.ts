/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 933f2ffd7161fb11839b1981bfc64433 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountTestsQueryVariables = {};
export type MyAccountTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyAccount_me">;
    } | null;
};
export type MyAccountTestsQuery = {
    readonly response: MyAccountTestsQueryResponse;
    readonly variables: MyAccountTestsQueryVariables;
};



/*
query MyAccountTestsQuery {
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
  hasPassword
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyAccountTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyAccount_me"
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
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyAccountTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "phone",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "paddleNumber",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "hasPassword",
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
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "933f2ffd7161fb11839b1981bfc64433",
    "metadata": {},
    "name": "MyAccountTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '83eb6b625a42186d1ea3c14b60d7b6cb';
export default node;
