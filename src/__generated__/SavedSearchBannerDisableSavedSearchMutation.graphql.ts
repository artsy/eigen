/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1d55cc406a47511f8cbad4f9d58adb10 */

import { ConcreteRequest } from "relay-runtime";
export type DisableSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
};
export type SavedSearchBannerDisableSavedSearchMutationVariables = {
    input: DisableSavedSearchInput;
};
export type SavedSearchBannerDisableSavedSearchMutationResponse = {
    readonly disableSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type SavedSearchBannerDisableSavedSearchMutation = {
    readonly response: SavedSearchBannerDisableSavedSearchMutationResponse;
    readonly variables: SavedSearchBannerDisableSavedSearchMutationVariables;
};



/*
mutation SavedSearchBannerDisableSavedSearchMutation(
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
    "name": "SavedSearchBannerDisableSavedSearchMutation",
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
    "name": "SavedSearchBannerDisableSavedSearchMutation",
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
    "id": "1d55cc406a47511f8cbad4f9d58adb10",
    "metadata": {},
    "name": "SavedSearchBannerDisableSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'cc429474e1db5d4dab4d92df4b214c3b';
export default node;
