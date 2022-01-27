/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b3fc2e423790fa05836aa7a401959a48 */

import { ConcreteRequest } from "relay-runtime";
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
export type getSavedSearchIdByCriteriaQueryVariables = {
    criteria?: SearchCriteriaAttributes | null | undefined;
};
export type getSavedSearchIdByCriteriaQueryResponse = {
    readonly me: {
        readonly savedSearch: {
            readonly internalID: string;
        } | null;
    } | null;
};
export type getSavedSearchIdByCriteriaQuery = {
    readonly response: getSavedSearchIdByCriteriaQueryResponse;
    readonly variables: getSavedSearchIdByCriteriaQueryVariables;
};



/*
query getSavedSearchIdByCriteriaQuery(
  $criteria: SearchCriteriaAttributes
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
    "name": "getSavedSearchIdByCriteriaQuery",
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
    "name": "getSavedSearchIdByCriteriaQuery",
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
    "id": "b3fc2e423790fa05836aa7a401959a48",
    "metadata": {},
    "name": "getSavedSearchIdByCriteriaQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'eed0aa5b47b336f60f70b978c01950b5';
export default node;
