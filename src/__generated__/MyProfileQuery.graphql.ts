/* tslint:disable */
/* eslint-disable */
/* @relayHash 0cb8ed6557e771412dfcb2e436df509e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileQueryVariables = {};
export type MyProfileQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfile_me">;
    } | null;
};
export type MyProfileQuery = {
    readonly response: MyProfileQueryResponse;
    readonly variables: MyProfileQueryVariables;
};



/*
query MyProfileQuery {
  me {
    ...MyProfile_me
    id
  }
}

fragment MyProfile_me on Me {
  name
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyProfileQuery",
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
            "name": "MyProfile_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyProfileQuery",
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
    "name": "MyProfileQuery",
    "id": "ca51a234fc2acd2d320730d713085b1c",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = 'fc2287d226489845236b2de22cf1ede8';
export default node;
