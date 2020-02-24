/* tslint:disable */

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
        readonly id: string | null;
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
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "cities",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "LinkedField",
  "alias": "locations",
  "name": "locationsConnection",
  "storageKey": "locationsConnection(first:0)",
  "args": [
    {
      "kind": "Literal",
      "name": "first",
      "value": 0
    }
  ],
  "concreteType": "LocationConnection",
  "plural": false,
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "totalCount",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "PartnerLocationSectionTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/)
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "PartnerLocationSectionTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "partner",
        "storageKey": "partner(id:\"gagosian\")",
        "args": (v0/*: any*/),
        "concreteType": "Partner",
        "plural": false,
        "selections": [
          (v1/*: any*/),
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "PartnerLocationSectionTestsQuery",
    "id": "1bec8afc0eec40c0cd822458a8dcccdd",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'd654766eb7ba94ff128b77162488a552';
export default node;
