/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairMoreInfoQueryVariables = {
    readonly fairID: string;
};
export type FairMoreInfoQueryResponse = {
    readonly fair: ({
        readonly organizer: ({
            readonly website: string | null;
        }) | null;
        readonly id: string;
        readonly _id: string;
        readonly about: string | null;
        readonly ticketsLink: string | null;
    }) | null;
};
export type FairMoreInfoQuery = {
    readonly response: FairMoreInfoQueryResponse;
    readonly variables: FairMoreInfoQueryVariables;
};



/*
query FairMoreInfoQuery(
  $fairID: String!
) {
  fair(id: $fairID) {
    organizer {
      website
    }
    id
    _id
    about
    ticketsLink
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
        "name": "organizer",
        "storageKey": null,
        "args": null,
        "concreteType": "organizer",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "website",
            "args": null,
            "storageKey": null
          }
        ]
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
        "name": "_id",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "about",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "ticketsLink",
        "args": null,
        "storageKey": null
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
  "name": "FairMoreInfoQuery",
  "id": "d76e1151c63e4910fb8886bc6960380a",
  "text": null,
  "metadata": {},
  "fragment": {
    "kind": "Fragment",
    "name": "FairMoreInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": v0,
    "selections": v1
  },
  "operation": {
    "kind": "Operation",
    "name": "FairMoreInfoQuery",
    "argumentDefinitions": v0,
    "selections": v1
  }
};
})();
(node as any).hash = 'f88594a64df67812db5bef52a8d5ae5f';
export default node;
