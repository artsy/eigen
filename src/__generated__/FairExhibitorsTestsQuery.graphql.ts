/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsTestsQueryVariables = {};
export type FairExhibitorsTestsQueryResponse = {
    readonly fair: ({
        readonly exhibitors_grouped_by_name: ReadonlyArray<({
            readonly letter: string | null;
            readonly exhibitors: ReadonlyArray<({
                readonly name: string | null;
                readonly gravityID: string;
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
        gravityID
        profile_id
        __id: id
      }
    }
    __id: id
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v1 = [
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
                "name": "gravityID",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "profile_id",
                "args": null,
                "storageKey": null
              },
              v0
            ]
          }
        ]
      },
      v0
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairExhibitorsTestsQuery",
  "id": null,
  "text": "query FairExhibitorsTestsQuery {\n  fair(id: \"art-basel-in-miami-beach-2018\") {\n    exhibitors_grouped_by_name {\n      letter\n      exhibitors {\n        name\n        gravityID\n        profile_id\n        __id: id\n      }\n    }\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsTestsQuery",
    "argumentDefinitions": [],
    "selections": v1
  }
};
})();
(node as any).hash = '48bc24459b211231935a2c059ec68240';
export default node;
