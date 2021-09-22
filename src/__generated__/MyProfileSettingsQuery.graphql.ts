/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d33d72de2a10c5c3cebf2267b2d22cf7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileSettingsQueryVariables = {};
export type MyProfileSettingsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileSettings_me">;
    } | null;
};
export type MyProfileSettingsQuery = {
    readonly response: MyProfileSettingsQueryResponse;
    readonly variables: MyProfileSettingsQueryVariables;
};



/*
query MyProfileSettingsQuery {
  me @optionalField {
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
    "name": "MyProfileSettingsQuery",
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
    "name": "MyProfileSettingsQuery",
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
    "id": "d33d72de2a10c5c3cebf2267b2d22cf7",
    "metadata": {},
    "name": "MyProfileSettingsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '878ea74ba98872181e78fd1bb5c39e84';
export default node;
