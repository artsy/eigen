/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsQueryVariables = {
    readonly fairID: string;
};
export type FairExhibitorsQueryResponse = {
    readonly fair: ({
        readonly id: string;
        readonly _id: string;
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
export type FairExhibitorsQuery = {
    readonly response: FairExhibitorsQueryResponse;
    readonly variables: FairExhibitorsQueryVariables;
};



/*
query FairExhibitorsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    id
    _id
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
    "kind": "LocalArgument",
    "name": "fairID",
    "type": "String!",
    "defaultValue": null
  }
],
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v2 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "fair",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "id",
        "variableName": "fairID",
        "type": "String!"
      }
    ],
    "concreteType": "Fair",
    "plural": false,
    "selections": [
      v1,
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "_id",
        "args": null,
        "storageKey": null
      },
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
              v1,
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
  "name": "FairExhibitorsQuery",
  "id": "0c078ac81109cf139b09ec767fc757fe",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v2
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsQuery",
    "argumentDefinitions": v0,
    "selections": v2
  }
};
})();
(node as any).hash = 'd7412fab9d3f851670a3958b92d86f04';
export default node;
