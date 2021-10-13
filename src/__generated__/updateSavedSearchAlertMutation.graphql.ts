/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fca79f7089d70c26102d82354c982915 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
    userAlertSettings?: UserAlertSettingsInput | null;
};
export type UserAlertSettingsInput = {
    email?: boolean | null;
    name?: string | null;
    push?: boolean | null;
};
export type updateSavedSearchAlertMutationVariables = {
    input: UpdateSavedSearchInput;
};
export type updateSavedSearchAlertMutationResponse = {
    readonly updateSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
            readonly userAlertSettings?: {
                readonly name: string | null;
            };
        };
    } | null;
};
export type updateSavedSearchAlertMutation = {
    readonly response: updateSavedSearchAlertMutationResponse;
    readonly variables: updateSavedSearchAlertMutationVariables;
};



/*
mutation updateSavedSearchAlertMutation(
  $input: UpdateSavedSearchInput!
) {
  updateSavedSearch(input: $input) {
    savedSearchOrErrors {
      __typename
      ... on SearchCriteria {
        internalID
        userAlertSettings {
          name
        }
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
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "SavedSearchUserAlertSettings",
      "kind": "LinkedField",
      "name": "userAlertSettings",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
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
    "name": "updateSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "updateSavedSearch",
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
    "name": "updateSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "UpdateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "updateSavedSearch",
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
    "id": "fca79f7089d70c26102d82354c982915",
    "metadata": {},
    "name": "updateSavedSearchAlertMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'a7f979686c79c31c5e09b00802b89fe6';
export default node;
