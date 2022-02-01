/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash edbad9ba004d96f1de808620c042d1ba */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
export type SavedSearchButtonRefetchQueryVariables = {
    criteria?: SearchCriteriaAttributes | null | undefined;
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

fragment CreateSavedSearchContentContainerV1_me on Me {
  emailFrequency
}

fragment SavedSearchButton_me_1ff8oJ on Me {
  ...CreateSavedSearchContentContainerV1_me
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
    "id": "edbad9ba004d96f1de808620c042d1ba",
    "metadata": {},
    "name": "SavedSearchButtonRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'bb861ba8a8b1a0bfdc3df4b1be75d027';
export default node;
