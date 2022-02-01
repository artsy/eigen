/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fb9f84c5e8aa1c472b0037446b577514 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditSavedSearchAlertRefetchQueryVariables = {};
export type EditSavedSearchAlertRefetchQueryResponse = {
    readonly user: {
        readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_user">;
    } | null;
};
export type EditSavedSearchAlertRefetchQuery = {
    readonly response: EditSavedSearchAlertRefetchQueryResponse;
    readonly variables: EditSavedSearchAlertRefetchQueryVariables;
};



/*
query EditSavedSearchAlertRefetchQuery {
  user: me {
    ...EditSavedSearchAlert_user
    id
  }
}

fragment EditSavedSearchAlert_user on Me {
  emailFrequency
}
*/

const node: ConcreteRequest = {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "EditSavedSearchAlertRefetchQuery",
    "selections": [
      {
        "alias": "user",
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "EditSavedSearchAlert_user"
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
    "name": "EditSavedSearchAlertRefetchQuery",
    "selections": [
      {
        "alias": "user",
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
    "id": "fb9f84c5e8aa1c472b0037446b577514",
    "metadata": {},
    "name": "EditSavedSearchAlertRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
(node as any).hash = '30499e96f2556b1fdcd85174653166a9';
export default node;
