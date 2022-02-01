/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 71cc5cc9edb22644186cb2b11b74eb7f */

import { ConcreteRequest } from "relay-runtime";
export type SearchCriteriaQueryVariables = {
    searchCriteriaId: string;
};
export type SearchCriteriaQueryResponse = {
    readonly me: {
        readonly email: string | null;
        readonly savedSearch: {
            readonly acquireable: boolean | null;
            readonly additionalGeneIDs: ReadonlyArray<string>;
            readonly atAuction: boolean | null;
            readonly attributionClass: ReadonlyArray<string>;
            readonly colors: ReadonlyArray<string>;
            readonly dimensionRange: string | null;
            readonly height: string | null;
            readonly inquireableOnly: boolean | null;
            readonly locationCities: ReadonlyArray<string>;
            readonly majorPeriods: ReadonlyArray<string>;
            readonly materialsTerms: ReadonlyArray<string>;
            readonly offerable: boolean | null;
            readonly partnerIDs: ReadonlyArray<string>;
            readonly priceRange: string | null;
            readonly width: string | null;
            readonly sizes: ReadonlyArray<string>;
        } | null;
    } | null;
};
export type SearchCriteriaQuery = {
    readonly response: SearchCriteriaQueryResponse;
    readonly variables: SearchCriteriaQueryVariables;
};



/*
query SearchCriteriaQuery(
  $searchCriteriaId: ID!
) {
  me {
    email
    savedSearch(id: $searchCriteriaId) {
      acquireable
      additionalGeneIDs
      atAuction
      attributionClass
      colors
      dimensionRange
      height
      inquireableOnly
      locationCities
      majorPeriods
      materialsTerms
      offerable
      partnerIDs
      priceRange
      width
      sizes
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
    "name": "searchCriteriaId"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "email",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "id",
      "variableName": "searchCriteriaId"
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
      "name": "acquireable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "additionalGeneIDs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "atAuction",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "attributionClass",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "colors",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "dimensionRange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "height",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inquireableOnly",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "locationCities",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "majorPeriods",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "materialsTerms",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "offerable",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "partnerIDs",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "priceRange",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "width",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sizes",
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
    "name": "SearchCriteriaQuery",
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
          (v2/*: any*/)
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
    "name": "SearchCriteriaQuery",
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
          (v2/*: any*/),
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
    "id": "71cc5cc9edb22644186cb2b11b74eb7f",
    "metadata": {},
    "name": "SearchCriteriaQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e2ac3f01c403ee98e4371131c54aad9b';
export default node;
