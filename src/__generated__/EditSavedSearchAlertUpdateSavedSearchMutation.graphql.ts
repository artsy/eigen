/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b0a9a1c53bc184c2101ccf3dcc36ae27 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
    userAlertSettings?: UserAlertSettingsInput | null;
};
export type UserAlertSettingsInput = {
    name?: string | null;
};
export type EditSavedSearchAlertUpdateSavedSearchMutationVariables = {
    input: UpdateSavedSearchInput;
};
export type EditSavedSearchAlertUpdateSavedSearchMutationResponse = {
    readonly updateSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
            readonly userAlertSettings?: {
                readonly name: string | null;
            };
        };
    } | null;
};
export type EditSavedSearchAlertUpdateSavedSearchMutation = {
    readonly response: EditSavedSearchAlertUpdateSavedSearchMutationResponse;
    readonly variables: EditSavedSearchAlertUpdateSavedSearchMutationVariables;
};



/*
mutation EditSavedSearchAlertUpdateSavedSearchMutation(
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
    "name": "EditSavedSearchAlertUpdateSavedSearchMutation",
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
    "name": "EditSavedSearchAlertUpdateSavedSearchMutation",
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
    "id": "b0a9a1c53bc184c2101ccf3dcc36ae27",
    "metadata": {},
    "name": "EditSavedSearchAlertUpdateSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '8f52570581b2b306f32180783990eb36';
export default node;
