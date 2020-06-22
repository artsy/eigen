/* tslint:disable */
/* eslint-disable */
/* @relayHash ee18d0191943f1ad69995edf53538f39 */

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
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountEditNameQuery",
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
            "name": "MyAccountEditName_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyAccountEditNameQuery",
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
    "name": "MyAccountEditNameQuery",
    "id": "062054af6d649b29fe0eaf46a35da6dd",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'c07b0787fa7a09e9afc7b083ad4faa0e';
export default node;
