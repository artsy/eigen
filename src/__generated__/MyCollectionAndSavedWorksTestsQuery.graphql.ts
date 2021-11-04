/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 3fbdf4898d34f038e5b8c560728a5443 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorksTestsQueryVariables = {};
export type MyCollectionAndSavedWorksTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me">;
    } | null;
};
export type MyCollectionAndSavedWorksTestsQuery = {
    readonly response: MyCollectionAndSavedWorksTestsQueryResponse;
    readonly variables: MyCollectionAndSavedWorksTestsQueryVariables;
};



/*
query MyCollectionAndSavedWorksTestsQuery {
  me @optionalField {
    ...MyCollectionAndSavedWorks_me
    id
  }
}

fragment MyCollectionAndSavedWorks_me on Me {
  name
  bio
  icon {
    url(version: "thumbnail")
  }
  createdAt
  ...MyProfileEditFormModal_me
}

fragment MyProfileEditFormModal_me on Me {
  name
  bio
  icon {
    url(version: "thumbnail")
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionAndSavedWorks_me"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Me",
        "kind": "LinkedField",
        "name": "me",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "icon",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": [
                  {
                    "kind": "Literal",
                    "name": "version",
                    "value": "thumbnail"
                  }
                ],
                "kind": "ScalarField",
                "name": "url",
                "storageKey": "url(version:\"thumbnail\")"
              }
            ],
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "createdAt",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "3fbdf4898d34f038e5b8c560728a5443",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.bio": (v0/*: any*/),
        "me.createdAt": (v0/*: any*/),
        "me.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.icon.url": (v0/*: any*/),
        "me.id": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "ID"
        },
        "me.name": (v0/*: any*/)
      }
    },
    "name": "MyCollectionAndSavedWorksTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '6510b5ab5aadfb3040f84106f4be7a50';
export default node;
