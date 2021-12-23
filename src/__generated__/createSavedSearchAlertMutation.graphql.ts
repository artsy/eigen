/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 8da0f987b20732772166f198dbc586b0 */

import { ConcreteRequest } from "relay-runtime";
export type CreateSavedSearchInput = {
    attributes: SearchCriteriaAttributes;
    clientMutationId?: string | null | undefined;
    userAlertSettings?: UserAlertSettingsInput | null | undefined;
};
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null | undefined;
    additionalGeneIDs?: Array<string> | null | undefined;
    artistID?: string | null | undefined;
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
export type createSavedSearchAlertMutationVariables = {
    input: CreateSavedSearchInput;
};
export type createSavedSearchAlertMutationResponse = {
    readonly createSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string | undefined;
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
