/* tslint:disable */
/* eslint-disable */
/* @relayHash ac3f23f34508ba373d504f69c9fbdfba */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyAccountEditPhoneQueryVariables = {};
export type MyAccountEditPhoneQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyAccountEditPhone_me">;
    } | null;
};
export type MyAccountEditPhoneQuery = {
    readonly response: MyAccountEditPhoneQueryResponse;
    readonly variables: MyAccountEditPhoneQueryVariables;
};



/*
query MyAccountEditPhoneQuery {
  me {
    ...MyAccountEditPhone_me
    id
  }
}

fragment MyAccountEditPhone_me on Me {
  phone
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyAccountEditPhoneQuery",
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
            "name": "MyAccountEditPhone_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyAccountEditPhoneQuery",
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
            "name": "phone",
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
    "name": "MyAccountEditPhoneQuery",
    "id": "c841f909061067fc539654747057c474",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '155d1d901e2064798aa49724f0c1a7e7';
export default node;
