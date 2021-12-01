/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash b635ab06273d929c97ba4b6d2e68a80f */

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
export type CreateSavedSearchContentContainerV2QueryVariables = {
    criteria: SearchCriteriaAttributes;
};
export type CreateSavedSearchContentContainerV2QueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
    } | null;
};
export type CreateSavedSearchContentContainerV2Query = {
    readonly response: CreateSavedSearchContentContainerV2QueryResponse;
    readonly variables: CreateSavedSearchContentContainerV2QueryVariables;
};



/*
query CreateSavedSearchContentContainerV2Query(
  $criteria: SearchCriteriaAttributes!
) {
  me {
    ...CreateSavedSearchContentContainerV2_me_1ff8oJ
    id
  }
}

fragment CreateSavedSearchContentContainerV2_me_1ff8oJ on Me {
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
    "name": "CreateSavedSearchContentContainerV2Query",
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
            "name": "CreateSavedSearchContentContainerV2_me"
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
    "name": "CreateSavedSearchContentContainerV2Query",
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
    "id": "b635ab06273d929c97ba4b6d2e68a80f",
    "metadata": {},
    "name": "CreateSavedSearchContentContainerV2Query",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '83e19f35cf81a2faacf7ed1828cf614f';
export default node;
