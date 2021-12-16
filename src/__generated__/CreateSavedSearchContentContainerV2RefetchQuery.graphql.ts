/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1ab7d09a51c2c1dc85e672dab4783d1f */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
export type CreateSavedSearchContentContainerV2RefetchQueryVariables = {
    criteria?: SearchCriteriaAttributes | null | undefined;
};
export type CreateSavedSearchContentContainerV2RefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"CreateSavedSearchContentContainerV2_me">;
    } | null;
};
export type CreateSavedSearchContentContainerV2RefetchQuery = {
    readonly response: CreateSavedSearchContentContainerV2RefetchQueryResponse;
    readonly variables: CreateSavedSearchContentContainerV2RefetchQueryVariables;
};



/*
query CreateSavedSearchContentContainerV2RefetchQuery(
  $criteria: SearchCriteriaAttributes
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
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
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
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
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
    "id": "1ab7d09a51c2c1dc85e672dab4783d1f",
    "metadata": {},
    "name": "CreateSavedSearchContentContainerV2RefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f0c000e35ef49f83f05a8e83f042b9fa';
export default node;
