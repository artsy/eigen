/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type PartnerLocationSectionTestsQueryVariables = {};
export type PartnerLocationSectionTestsQueryResponse = {
    readonly partner: {
        readonly name: string | null;
        readonly cities: ReadonlyArray<string | null> | null;
    } | null;
};
export type PartnerLocationSectionTestsQueryRawResponse = {
    readonly partner: ({
        readonly name: string | null;
        readonly cities: ReadonlyArray<string | null> | null;
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
          (v2/*: any*/)
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
    "id": "bd82f5d04904ca8e8f3a20e663881587",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '12f978dce4e1a52d0c71dba5cfc09769';
export default node;
