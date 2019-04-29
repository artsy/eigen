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
        readonly gravityID: string;
        readonly internalID: string;
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
    gravityID
    internalID
    about
    ticketsLink
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
        "name": "gravityID",
        "args": null,
        "storageKey": null
      },
      {
        "kind": "ScalarField",
        "alias": null,
        "name": "internalID",
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
        "alias": "__id",
        "name": "id",
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
  "id": null,
  "text": "query FairMoreInfoQuery(\n  $fairID: String!\n) {\n  fair(id: $fairID) {\n    organizer {\n      website\n    }\n    gravityID\n    internalID\n    about\n    ticketsLink\n    __id: id\n  }\n}\n",
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
(node as any).hash = '0d41af657074535f2c67825a65f62bf3';
export default node;
