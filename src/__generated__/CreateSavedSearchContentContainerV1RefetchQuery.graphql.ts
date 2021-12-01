/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d06dc54f6a74d2e2e329fb236dcaa9e3 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV1RefetchQueryVariables = {};
export type CreateSavedSearchContentContainerV1RefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV1_me">;
    } | null;
};
export type CreateSavedSearchContentContainerV1RefetchQuery = {
    readonly response: CreateSavedSearchContentContainerV1RefetchQueryResponse;
    readonly variables: CreateSavedSearchContentContainerV1RefetchQueryVariables;
};



/*
query CreateSavedSearchContentContainerV1RefetchQuery {
  me {
    ...CreateSavedSearchContentContainerV1_me
    id
  }
}

fragment CreateSavedSearchContentContainerV1_me on Me {
  emailFrequency
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSavedSearchContentContainerV1RefetchQuery",
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
            "name": "CreateSavedSearchContentContainerV1_me"
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
    "name": "CreateSavedSearchContentContainerV1RefetchQuery",
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
            "name": "emailFrequency",
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
    "id": "d06dc54f6a74d2e2e329fb236dcaa9e3",
    "metadata": {},
    "name": "CreateSavedSearchContentContainerV1RefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'e3b8e7edc2c119f43f688f12d2c5dce7';
export default node;
