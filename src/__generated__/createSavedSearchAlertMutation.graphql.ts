/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 8da0f987b20732772166f198dbc586b0 */

import { ConcreteRequest } from "relay-runtime";
export type CreateSavedSearchInput = {
    attributes: SearchCriteriaAttributes;
    clientMutationId?: string | null;
    userAlertSettings?: UserAlertSettingsInput | null;
};
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null;
    additionalGeneIDs?: Array<string> | null;
    artistID?: string | null;
    atAuction?: boolean | null;
    attributionClass?: Array<string> | null;
    colors?: Array<string> | null;
    dimensionRange?: string | null;
    height?: string | null;
    inquireableOnly?: boolean | null;
    locationCities?: Array<string> | null;
    majorPeriods?: Array<string> | null;
    materialsTerms?: Array<string> | null;
    offerable?: boolean | null;
    partnerIDs?: Array<string> | null;
    priceRange?: string | null;
    sizes?: Array<string> | null;
    width?: string | null;
};
export type UserAlertSettingsInput = {
    email?: boolean | null;
    name?: string | null;
    push?: boolean | null;
};
export type createSavedSearchAlertMutationVariables = {
    input: CreateSavedSearchInput;
};
export type createSavedSearchAlertMutationResponse = {
    readonly createSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type createSavedSearchAlertMutation = {
    readonly response: createSavedSearchAlertMutationResponse;
    readonly variables: createSavedSearchAlertMutationVariables;
};



/*
mutation createSavedSearchAlertMutation(
  $input: CreateSavedSearchInput!
) {
  createSavedSearch(input: $input) {
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
    "name": "createSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "createSavedSearch",
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
    "name": "createSavedSearchAlertMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "CreateSavedSearchPayload",
        "kind": "LinkedField",
        "name": "createSavedSearch",
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
    "id": "8da0f987b20732772166f198dbc586b0",
    "metadata": {},
    "name": "createSavedSearchAlertMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '5dc7cf49cf14f0328a9f6c5ef66e72c9';
export default node;
