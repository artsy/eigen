/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3d478c267bb38cf0be324dd2ab1dcef8 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchContentContainerV2RefetchQueryVariables = {};
export type CreateSavedSearchContentContainerV2RefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
    } | null;
};
export type CreateSavedSearchContentContainerV2RefetchQuery = {
    readonly response: CreateSavedSearchContentContainerV2RefetchQueryResponse;
    readonly variables: CreateSavedSearchContentContainerV2RefetchQueryVariables;
};



/*
query CreateSavedSearchContentContainerV2RefetchQuery {
  me {
    ...CreateSavedSearchContentContainerV2_me
    id
  }
}

fragment CreateSavedSearchContentContainerV2_me on Me {
  emailFrequency
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
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
            "name": "CreateSavedSearchContentContainerV2_me"
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
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
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
    "id": "3d478c267bb38cf0be324dd2ab1dcef8",
    "metadata": {},
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '1e50ee2a72c8d4b281fcf57c2fb43898';
export default node;
