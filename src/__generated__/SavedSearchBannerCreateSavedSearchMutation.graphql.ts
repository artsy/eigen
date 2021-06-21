/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2d4ce3cc3701a50d6da342637f2e179c */

import { ConcreteRequest } from "relay-runtime";
export type CreateSavedSearchInput = {
    attributes?: SearchCriteriaAttributes | null;
    clientMutationId?: string | null;
};
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null;
    additionalGeneIDs?: Array<string> | null;
    artistID?: string | null;
    atAuction?: boolean | null;
    attributionClass?: Array<string> | null;
    attributionClasses?: Array<string> | null;
    colors?: Array<string> | null;
    dimensionRange?: string | null;
    dimensionScoreMax?: number | null;
    dimensionScoreMin?: number | null;
    height?: string | null;
    heightMax?: number | null;
    heightMin?: number | null;
    inquireableOnly?: boolean | null;
    locationCities?: Array<string> | null;
    majorPeriods?: Array<string> | null;
    materialsTerms?: Array<string> | null;
    offerable?: boolean | null;
    partnerIDs?: Array<string> | null;
    priceMax?: number | null;
    priceMin?: number | null;
    priceRange?: string | null;
    width?: number | null;
    widthMax?: number | null;
    widthMin?: number | null;
};
export type SavedSearchBannerCreateSavedSearchMutationVariables = {
    input: CreateSavedSearchInput;
};
export type SavedSearchBannerCreateSavedSearchMutationResponse = {
    readonly createSavedSearch: {
        readonly savedSearchOrErrors: {
            readonly internalID?: string;
        };
    } | null;
};
export type SavedSearchBannerCreateSavedSearchMutation = {
    readonly response: SavedSearchBannerCreateSavedSearchMutationResponse;
    readonly variables: SavedSearchBannerCreateSavedSearchMutationVariables;
};



/*
mutation SavedSearchBannerCreateSavedSearchMutation(
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
    "name": "SavedSearchBannerCreateSavedSearchMutation",
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
    "name": "SavedSearchBannerCreateSavedSearchMutation",
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
    "id": "2d4ce3cc3701a50d6da342637f2e179c",
    "metadata": {},
    "name": "SavedSearchBannerCreateSavedSearchMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'ec74f515330205f5267cbaee00cf40f3';
export default node;
