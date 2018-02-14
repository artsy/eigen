/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type QueryRenderersMyProfileQueryVariables = {
};
export type QueryRenderersMyProfileQueryResponse = {
    readonly me: ({
    }) | null;
};



/*
query QueryRenderersMyProfileQuery {
  me {
    ...MyProfile_me
    __id
  }
}

fragment MyProfile_me on Me {
  name
  initials
  __id
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "operationKind": "query",
  "name": "QueryRenderersMyProfileQuery",
  "id": null,
  "text": "query QueryRenderersMyProfileQuery {\n  me {\n    ...MyProfile_me\n    __id\n  }\n}\n\nfragment MyProfile_me on Me {\n  name\n  initials\n  __id\n}\n",
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
