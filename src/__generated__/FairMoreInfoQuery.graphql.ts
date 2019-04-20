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
    gravityID
    _id
    about
    ticketsLink
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
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "FairMoreInfoQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "FairMoreInfoQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "query",
    "name": "FairMoreInfoQuery",
    "id": "96be176d8eb2bca6d5146ea07b8310ab",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '96be176d8eb2bca6d5146ea07b8310ab';
export default node;
