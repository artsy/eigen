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
    __id: id
  }
}

fragment MyProfile_me on Me {
  name
  initials
  __id: id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": "__id",
  "name": "id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersMyProfileQuery",
  "id": null,
  "text": "query QueryRenderersMyProfileQuery {\n  me {\n    ...MyProfile_me\n    __id: id\n  }\n}\n\nfragment MyProfile_me on Me {\n  name\n  initials\n  __id: id\n}\n",
  "metadata": {},
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
          },
          v0
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
          v0
        ]
      }
    ]
  }
};
})();
(node as any).hash = '748438ac1bef6795f42e7ff471971cde';
export default node;
