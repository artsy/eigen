/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d89aa1537e546b4c527f39e75914cd6a */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type SearchCriteriaAttributes = {
    acquireable?: boolean | null;
    additionalGeneIDs?: Array<string> | null;
    artistID?: string | null;
    atAuction?: boolean | null;
    attributionClasses?: Array<string> | null;
    colors?: Array<string> | null;
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
    size?: string | null;
    widthMax?: number | null;
    widthMin?: number | null;
};
export type SavedSearchBannerRefetchQueryVariables = {
    criteria?: SearchCriteriaAttributes | null;
};
export type SavedSearchBannerRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchBanner_me">;
    } | null;
};
export type SavedSearchBannerRefetchQuery = {
    readonly response: SavedSearchBannerRefetchQueryResponse;
    readonly variables: SavedSearchBannerRefetchQueryVariables;
};



/*
query SavedSearchBannerRefetchQuery(
  $criteria: SearchCriteriaAttributes
) {
  me {
    ...SavedSearchBanner_me_1ff8oJ
    id
  }
}

fragment SavedSearchBanner_me_1ff8oJ on Me {
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
    "name": "SavedSearchBannerRefetchQuery",
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
            "name": "SavedSearchBanner_me"
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
    "name": "SavedSearchBannerRefetchQuery",
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
    "id": "d89aa1537e546b4c527f39e75914cd6a",
    "metadata": {},
    "name": "SavedSearchBannerRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '84d5acca4fb834201e1c974321cbcae9';
export default node;
