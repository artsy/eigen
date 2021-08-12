/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 08207471bf58838f6c895837c8384c38 */

import { ConcreteRequest } from "relay-runtime";
export type SavedSearchAlertQueryVariables = {
    savedSearchAlertId: string;
};
export type SavedSearchAlertQueryResponse = {
    readonly me: {
        readonly savedSearch: {
            readonly internalID: string;
            readonly acquireable: boolean | null;
            readonly additionalGeneIDs: ReadonlyArray<string>;
            readonly artistID: string | null;
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
            readonly userAlertSettings: {
                readonly name: string | null;
            };
            readonly width: string | null;
        } | null;
    } | null;
};
export type SavedSearchAlertQuery = {
    readonly response: SavedSearchAlertQueryResponse;
    readonly variables: SavedSearchAlertQueryVariables;
};



/*
query SavedSearchAlertQuery(
  $savedSearchAlertId: ID!
) {
  me {
    savedSearch(id: $savedSearchAlertId) {
      internalID
      acquireable
      additionalGeneIDs
      artistID
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
      userAlertSettings {
        name
      }
      width
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
    "name": "savedSearchAlertId"
  }
],
v1 = {
  "alias": null,
  "args": [
    {
      "kind": "Variable",
      "name": "id",
      "variableName": "savedSearchAlertId"
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
    },
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
      "name": "artistID",
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
      "concreteType": "SavedSearchUserAlertSettings",
      "kind": "LinkedField",
      "name": "userAlertSettings",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "name",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "width",
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
    "name": "SavedSearchAlertQuery",
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
    "name": "SavedSearchAlertQuery",
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
    "id": "08207471bf58838f6c895837c8384c38",
    "metadata": {},
    "name": "SavedSearchAlertQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '339d772e996883602600d50b4ecf22bc';
export default node;
