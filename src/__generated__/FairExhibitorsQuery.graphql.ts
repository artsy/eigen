/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsQueryVariables = {
    readonly fairID: string;
};
export type FairExhibitorsQueryResponse = {
    readonly fair: ({
        readonly gravityID: string;
        readonly internalID: string;
        readonly exhibitors_grouped_by_name: ReadonlyArray<({
            readonly letter: string | null;
            readonly exhibitors: ReadonlyArray<({
                readonly name: string | null;
                readonly gravityID: string;
                readonly profile_id: string | null;
                readonly partner_id: string | null;
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
    gravityID
    internalID
    exhibitors_grouped_by_name {
      letter
      exhibitors {
        name
        gravityID
        profile_id
        partner_id
        __id: id
      }
    }
    __id: id
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
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = [
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
        "name": "internalID",
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
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "partner_id",
                "args": null,
                "storageKey": null
              },
              v2
            ]
          }
        ]
      },
      v2
    ]
  }
];
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "FairExhibitorsQuery",
  "id": null,
  "text": "query FairExhibitorsQuery(\n  $fairID: String!\n) {\n  fair(id: $fairID) {\n    gravityID\n    internalID\n    exhibitors_grouped_by_name {\n      letter\n      exhibitors {\n        name\n        gravityID\n        profile_id\n        partner_id\n        __id: id\n      }\n    }\n    __id: id\n  }\n}\n",
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v3
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsQuery",
    "argumentDefinitions": v0,
    "selections": v3
  }
};
})();
(node as any).hash = '9b3a8dfed1174d383384f086d200f959';
export default node;
