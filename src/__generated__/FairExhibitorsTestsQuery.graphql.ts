/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsTestsQueryVariables = {};
export type FairExhibitorsTestsQueryResponse = {
    readonly fair: ({
        readonly exhibitors_grouped_by_name: ReadonlyArray<({
            readonly letter: string | null;
            readonly exhibitors: ReadonlyArray<({
                readonly name: string | null;
                readonly id: string | null;
                readonly profile_id: string | null;
            }) | null> | null;
        }) | null> | null;
    }) | null;
};
export type FairExhibitorsTestsQuery = {
    readonly response: FairExhibitorsTestsQueryResponse;
    readonly variables: FairExhibitorsTestsQueryVariables;
};



/*
query FairExhibitorsTestsQuery {
  fair(id: "art-basel-in-miami-beach-2018") {
    exhibitors_grouped_by_name {
      letter
      exhibitors {
        name
        id
        profile_id
      }
    }
    __id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "fair",
    "storageKey": "fair(id:\"art-basel-in-miami-beach-2018\")",
    "args": [
      {
        "kind": "Literal",
        "name": "id",
        "value": "art-basel-in-miami-beach-2018",
        "type": "String!"
      }
    ],
    "concreteType": "Fair",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "exhibitors_grouped_by_name",
        "storageKey": null,
        "args": null,
        "concreteType": "FairExhibitorsGroup",
        "plural": true,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "letter",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "exhibitors",
            "storageKey": null,
            "args": null,
            "concreteType": "FairExhibitor",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "name",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "id",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "profile_id",
                "args": null,
                "storageKey": null
              }
            ]
          }
        ]
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "__id",
        "args": null,
        "storageKey": null
      }
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairExhibitorsTestsQuery",
  "id": "3e46c6aa2eae83724a8b6edb75dce53b",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v0
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsTestsQuery",
    "argumentDefinitions": [],
    "selections": v0
  }
};
})();
(node as any).hash = 'cbfa24bee4a376dea1245376746f0c5a';
export default node;
