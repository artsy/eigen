/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 15f1f7acaf852cdd59b83431c99f24b7 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CreateSavedSearchAlertTestsQueryVariables = {};
export type CreateSavedSearchAlertTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV1_me">;
    } | null;
};
export type CreateSavedSearchAlertTestsQuery = {
    readonly response: CreateSavedSearchAlertTestsQueryResponse;
    readonly variables: CreateSavedSearchAlertTestsQueryVariables;
};



/*
query CreateSavedSearchAlertTestsQuery {
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
    "name": "CreateSavedSearchAlertTestsQuery",
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
    "name": "CreateSavedSearchAlertTestsQuery",
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
    "id": "15f1f7acaf852cdd59b83431c99f24b7",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.emailFrequency": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "String"
        },
        "me.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        }
      }
    },
    "name": "CreateSavedSearchAlertTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = 'eb791f7e4bffed09da7ec57300c0db49';
export default node;
