/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { MyProfile_me$ref } from "./MyProfile_me.graphql";
export type QueryRenderersMyProfileQueryVariables = {};
export type QueryRenderersMyProfileQueryResponse = {
    readonly me: ({
        readonly " $fragmentRefs": MyProfile_me$ref;
    }) | null;
};
export type QueryRenderersMyProfileQuery = {
    readonly response: QueryRenderersMyProfileQueryResponse;
    readonly variables: QueryRenderersMyProfileQueryVariables;
};



/*
query QueryRenderersMyProfileQuery {
  me {
    ...MyProfile_me
    id
  }
}

fragment MyProfile_me on Me {
  name
  initials
}
*/

const node: ConcreteRequest = {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "QueryRenderersMyProfileQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "FragmentSpread",
            "name": "MyProfile_me",
            "args": null
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "QueryRenderersMyProfileQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
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
            "name": "initials",
            "args": null,
            "storageKey": null
          },
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
    "name": "QueryRenderersMyProfileQuery",
    "id": "748438ac1bef6795f42e7ff471971cde",
    "text": null,
    "metadata": {}
  }
};
(node as any).hash = '748438ac1bef6795f42e7ff471971cde';
export default node;
