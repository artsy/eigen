/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d2fd6e28db63106c549fa5e62c0b0bcd */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileSettingsTestsQueryVariables = {};
export type MyProfileSettingsTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileSettings_me">;
    } | null;
};
export type MyProfileSettingsTestsQuery = {
    readonly response: MyProfileSettingsTestsQueryResponse;
    readonly variables: MyProfileSettingsTestsQueryVariables;
};



/*
query MyProfileSettingsTestsQuery {
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
    "name": "MyProfileSettingsTestsQuery",
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
    "name": "MyProfileSettingsTestsQuery",
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
    "id": "d2fd6e28db63106c549fa5e62c0b0bcd",
    "metadata": {},
    "name": "MyProfileSettingsTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '6dc82964d7990f731522bbc7e711391b';
export default node;
