/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 49a9660077d5ee2cfb30cfde706fb0ee */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
export type SavedSearchBannerTestsQueryVariables = {
    criteria: SearchCriteriaAttributes;
};
export type SavedSearchBannerTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchBanner_me">;
    } | null;
};
export type SavedSearchBannerTestsQuery = {
    readonly response: SavedSearchBannerTestsQueryResponse;
    readonly variables: SavedSearchBannerTestsQueryVariables;
};



/*
query SavedSearchBannerTestsQuery(
  $criteria: SearchCriteriaAttributes!
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
],
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "SavedSearchBannerTestsQuery",
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
    "name": "SavedSearchBannerTestsQuery",
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
    "id": "49a9660077d5ee2cfb30cfde706fb0ee",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.id": (v2/*: any*/),
        "me.savedSearch": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "SearchCriteria"
        },
        "me.savedSearch.internalID": (v2/*: any*/)
      }
    },
    "name": "SavedSearchBannerTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ccd74d9b109fe4a436fbcdceeb46e417';
export default node;
