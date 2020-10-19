/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 1bec8afc0eec40c0cd822458a8dcccdd */

import { ConcreteRequest } from "relay-runtime";
export type PartnerLocationSectionTestsQueryVariables = {};
export type PartnerLocationSectionTestsQueryResponse = {
    readonly partner: {
        readonly name: string | null;
        readonly cities: ReadonlyArray<string | null> | null;
        readonly locations: {
            readonly totalCount: number | null;
        } | null;
    } | null;
};
export type PartnerLocationSectionTestsQueryRawResponse = {
    readonly partner: ({
        readonly name: string | null;
        readonly cities: ReadonlyArray<string | null> | null;
        readonly locations: ({
            readonly totalCount: number | null;
        }) | null;
        readonly id: string;
    }) | null;
};
export type PartnerLocationSectionTestsQuery = {
    readonly response: PartnerLocationSectionTestsQueryResponse;
    readonly variables: PartnerLocationSectionTestsQueryVariables;
    readonly rawResponse: PartnerLocationSectionTestsQueryRawResponse;
};



/*
query PartnerLocationSectionTestsQuery {
  partner(id: "gagosian") {
    name
    cities
    locations: locationsConnection(first: 0) {
      totalCount
    }
    id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "gagosian"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "cities",
  "storageKey": null
},
v3 = {
  "alias": "locations",
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 0
    }
  ],
  "concreteType": "LocationConnection",
  "kind": "LinkedField",
  "name": "locationsConnection",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "totalCount",
      "storageKey": null
    }
  ],
  "storageKey": "locationsConnection(first:0)"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "PartnerLocationSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ],
        "storageKey": "partner(id:\"gagosian\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "PartnerLocationSectionTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "kind": "LinkedField",
        "name": "partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "partner(id:\"gagosian\")"
      }
    ]
  },
  "params": {
    "id": "1bec8afc0eec40c0cd822458a8dcccdd",
    "metadata": {},
    "name": "PartnerLocationSectionTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd654766eb7ba94ff128b77162488a552';
export default node;
