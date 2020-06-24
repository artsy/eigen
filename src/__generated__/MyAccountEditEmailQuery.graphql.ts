/* tslint:disable */
/* eslint-disable */
/* @relayHash da1a65c09f6e5c28a1d3e18824bacb49 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditEmailQueryVariables = {};
export type MyAccountEditEmailQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyAccountEditEmail_me">;
    } | null;
};
export type MyAccountEditEmailQuery = {
    readonly response: MyAccountEditEmailQueryResponse;
    readonly variables: MyAccountEditEmailQueryVariables;
};



/*
query MyAccountEditEmailQuery {
  me {
    ...MyAccountEditEmail_me
    id
  }
}

fragment MyAccountEditEmail_me on Me {
  email
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountEditEmailQuery",
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
            "name": "MyAccountEditEmail_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyAccountEditEmailQuery",
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
            "name": "email",
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
    "name": "MyAccountEditEmailQuery",
    "id": "9fcc3bdc711b8a302f8bd21289fae194",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '2b7fc72c78f1fe29014ef6fa30a83077';
export default node;
