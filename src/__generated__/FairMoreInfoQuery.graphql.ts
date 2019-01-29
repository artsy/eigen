/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type FairMoreInfoQueryVariables = {
    readonly fairID: string;
};
export type FairMoreInfoQueryResponse = {
    readonly fair: ({
        readonly links: string | null;
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
    links
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
        "kind": "ScalarField",
        "alias": null,
        "name": "links",
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
  "id": "af7669110691bb6ead956db54ce4b40b",
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
(node as any).hash = '492a03aa463ac56e061915787f79f57f';
export default node;
