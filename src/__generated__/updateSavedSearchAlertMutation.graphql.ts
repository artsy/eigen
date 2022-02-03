/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash fca79f7089d70c26102d82354c982915 */

import { ConcreteRequest } from "relay-runtime";
export type UpdateSavedSearchInput = {
    attributes?: SearchCriteriaAttributes | null | undefined;
    clientMutationId?: string | null | undefined;
    searchCriteriaID: string;
    userAlertSettings?: UserAlertSettingsInput | null | undefined;
};
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null | undefined;
    additionalGeneIDs?: Array<string> | null | undefined;
    artistID?: string | null | undefined;
    artistIDs?: Array<string> | null | undefined;
    atAuction?: boolean | null | undefined;
    attributionClass?: Array<string> | null | undefined;
    colors?: Array<string> | null | undefined;
    dimensionRange?: string | null | undefined;
    height?: string | null | undefined;
    inquireableOnly?: boolean | null | undefined;
    locationCities?: Array<string> | null | undefined;
    majorPeriods?: Array<string> | null | undefined;
    materialsTerms?: Array<string> | null | undefined;
    offerable?: boolean | null | undefined;
    partnerIDs?: Array<string> | null | undefined;
    priceRange?: string | null | undefined;
    sizes?: Array<string> | null | undefined;
    width?: string | null | undefined;
};
export type UserAlertSettingsInput = {
    email?: boolean | null | undefined;
    name?: string | null | undefined;
    push?: boolean | null | undefined;
};
export type updateSavedSearchAlertMutationVariables = {
    input: UpdateSavedSearchInput;
};
export type updateSavedSearchAlertMutationResponse = {
    readonly updateSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string | undefined;
            readonly userAlertSettings?: {
                readonly name: string | null;
            } | undefined;
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
