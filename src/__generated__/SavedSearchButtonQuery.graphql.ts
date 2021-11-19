/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d93b72524739eb524d1f4cd9509ced17 */

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
export type SavedSearchButtonQueryVariables = {
    criteria: SearchCriteriaAttributes;
};
export type SavedSearchButtonQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"SavedSearchButton_me">;
    } | null;
};
export type SavedSearchButtonQuery = {
    readonly response: SavedSearchButtonQueryResponse;
    readonly variables: SavedSearchButtonQueryVariables;
};



/*
query SavedSearchButtonQuery(
  $criteria: SearchCriteriaAttributes!
) {
  me {
    ...SavedSearchButton_me_1ff8oJ
    id
  }
}

fragment SavedSearchButton_me_1ff8oJ on Me {
  emailFrequency
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
    "name": "SavedSearchButtonQuery",
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
    "name": "SavedSearchButtonQuery",
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
    "id": "d93b72524739eb524d1f4cd9509ced17",
    "metadata": {},
    "name": "SavedSearchButtonQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '449e4412d84929d7c547ad86d3657c1b';
export default node;
