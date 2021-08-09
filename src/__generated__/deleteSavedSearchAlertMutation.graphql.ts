/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 7bd7cccae261a90832e94b3852427c30 */

import { ConcreteRequest } from "relay-runtime";
export type DisableSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
};
export type deleteSavedSearchAlertMutationVariables = {
    input: DisableSavedSearchInput;
};
export type deleteSavedSearchAlertMutationResponse = {
    readonly disableSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type deleteSavedSearchAlertMutation = {
    readonly response: deleteSavedSearchAlertMutationResponse;
    readonly variables: deleteSavedSearchAlertMutationVariables;
};



/*
mutation deleteSavedSearchAlertMutation(
  $input: DisableSavedSearchInput!
) {
  disableSavedSearch(input: $input) {
    savedSearchOrErrors {
      __typename
      ... on SearchCriteria {
        internalID
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    }
  ],
  "type": "SearchCriteria",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DisableSavedSearchPayload",
        "kind": "LinkedField",
        "name": "disableSavedSearch",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "savedSearchOrErrors",
            "plural": false,
            "selections": [
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "deleteSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DisableSavedSearchPayload",
        "kind": "LinkedField",
        "name": "disableSavedSearch",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "savedSearchOrErrors",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "7bd7cccae261a90832e94b3852427c30",
    "metadata": {},
    "name": "deleteSavedSearchAlertMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'e60bb2d52a6003c9d40767933daaa7bd';
export default node;
