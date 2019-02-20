/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairExhibitorsQueryVariables = {
    readonly fairID: string;
};
export type FairExhibitorsQueryResponse = {
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
export type FairExhibitorsQuery = {
    readonly response: FairExhibitorsQueryResponse;
    readonly variables: FairExhibitorsQueryVariables;
};



/*
query FairExhibitorsQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
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
v1 = [
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
  "name": "FairExhibitorsQuery",
  "id": "a80412e826e25b99ff2412e1d73fedfe",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairExhibitorsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "FairExhibitorsQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = '49d86459c44ccc08847c6ade7629cddf';
export default node;
