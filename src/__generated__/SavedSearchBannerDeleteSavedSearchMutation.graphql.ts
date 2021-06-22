/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 956ec3ea65b6fb1a68dabdf45a966f9f */

import { ConcreteRequest } from "relay-runtime";
export type DeleteSavedSearchInput = {
    clientMutationId?: string | null;
    searchCriteriaID: string;
};
export type SavedSearchBannerDeleteSavedSearchMutationVariables = {
    input: DeleteSavedSearchInput;
};
export type SavedSearchBannerDeleteSavedSearchMutationResponse = {
    readonly deleteSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type SavedSearchBannerDeleteSavedSearchMutation = {
    readonly response: SavedSearchBannerDeleteSavedSearchMutationResponse;
    readonly variables: SavedSearchBannerDeleteSavedSearchMutationVariables;
};



/*
mutation SavedSearchBannerDeleteSavedSearchMutation(
  $input: DeleteSavedSearchInput!
) {
  deleteSavedSearch(input: $input) {
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
    "name": "SavedSearchBannerDeleteSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteSavedSearchPayload",
        "kind": "LinkedField",
        "name": "deleteSavedSearch",
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
    "name": "SavedSearchBannerDeleteSavedSearchMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteSavedSearchPayload",
        "kind": "LinkedField",
        "name": "deleteSavedSearch",
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
    "id": "956ec3ea65b6fb1a68dabdf45a966f9f",
    "metadata": {},
    "name": "SavedSearchBannerDeleteSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '4aa47c8faec3244c12d629027d56602d';
export default node;
