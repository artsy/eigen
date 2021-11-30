/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b7bcaeb8d504648efd11bc1a8721ff27 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
    width?: string | null;
};
export type SavedSearchButtonRefetchQueryVariables = {
    criteria?: SearchCriteriaAttributes | null;
};
export type SavedSearchButtonRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchButton_me">;
    } | null;
};
export type SavedSearchButtonRefetchQuery = {
    readonly response: SavedSearchButtonRefetchQueryResponse;
    readonly variables: SavedSearchButtonRefetchQueryVariables;
};



/*
query SavedSearchButtonRefetchQuery(
  $criteria: SearchCriteriaAttributes
) {
  me {
    ...SavedSearchButton_me_1ff8oJ
    id
  }
}

fragment CreateSavedSearchAlertScreen_me on Me {
  emailFrequency
}

fragment SavedSearchButton_me_1ff8oJ on Me {
  ...CreateSavedSearchAlertScreen_me
  savedSearch(criteria: $criteria) {
    internalID
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "criteria"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "criteria",
    "variableName": "criteria"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedSearchButtonRefetchQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": (v1/*: any*/),
            "kind": "FragmentSpread",
            "name": "SavedSearchButton_me"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "SavedSearchButtonRefetchQuery",
    "selections": [
      {
        "alias": null,
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
            "args": (v1/*: any*/),
            "concreteType": "SearchCriteria",
            "kind": "LinkedField",
            "name": "savedSearch",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "internalID",
                "storageKey": null
              }
            ],
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
    "id": "b7bcaeb8d504648efd11bc1a8721ff27",
    "metadata": {},
    "name": "SavedSearchButtonRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'bb861ba8a8b1a0bfdc3df4b1be75d027';
export default node;
