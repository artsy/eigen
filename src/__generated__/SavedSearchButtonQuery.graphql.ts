/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 0e4f0773764f0453f181d81d21ed4882 */

import { ConcreteRequest } from "relay-runtime";
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
        readonly savedSearch: {
            readonly internalID: string;
        } | null;
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
    savedSearch(criteria: $criteria) {
      internalID
    }
    id
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
v1 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "criteria",
      "variableName": "criteria"
    }
  ],
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
};
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
          (v1/*: any*/)
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
          (v1/*: any*/),
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
    "id": "0e4f0773764f0453f181d81d21ed4882",
    "metadata": {},
    "name": "SavedSearchButtonQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f0dd7ec6b20568c11ae92595c1350cf3';
export default node;
