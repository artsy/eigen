/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 8062e27c43f048e3f25fc803083931dd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileSettingsRefetchQueryVariables = {};
export type MyProfileSettingsRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileSettings_me">;
    } | null;
};
export type MyProfileSettingsRefetchQuery = {
    readonly response: MyProfileSettingsRefetchQueryResponse;
    readonly variables: MyProfileSettingsRefetchQueryVariables;
};



/*
query MyProfileSettingsRefetchQuery {
  me {
    ...MyProfileSettings_me
    id
  }
}

fragment MyProfileSettings_me on Me {
  labFeatures
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyProfileSettingsRefetchQuery",
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
            "name": "MyProfileSettings_me"
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
    "name": "MyProfileSettingsRefetchQuery",
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
            "name": "labFeatures",
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
    "id": "8062e27c43f048e3f25fc803083931dd",
    "metadata": {},
    "name": "MyProfileSettingsRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '3fdc4f8b9f5ee3b6750e0516edda4ee5';
export default node;
