/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 062054af6d649b29fe0eaf46a35da6dd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditNameQueryVariables = {};
export type MyAccountEditNameQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyAccountEditName_me">;
    } | null;
};
export type MyAccountEditNameQuery = {
    readonly response: MyAccountEditNameQueryResponse;
    readonly variables: MyAccountEditNameQueryVariables;
};



/*
query MyAccountEditNameQuery {
  me {
    ...MyAccountEditName_me
    id
  }
}

fragment MyAccountEditName_me on Me {
  name
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyAccountEditNameQuery",
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
            "name": "MyAccountEditName_me"
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
    "name": "MyAccountEditNameQuery",
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "062054af6d649b29fe0eaf46a35da6dd",
    "metadata": {},
    "name": "MyAccountEditNameQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'c07b0787fa7a09e9afc7b083ad4faa0e';
export default node;
