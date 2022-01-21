/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 4c305c6f3ab0d1c91673fdd97c36630e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileEditFormModalTestsQueryVariables = {};
export type MyProfileEditFormModalTestsQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
    } | null;
};
export type MyProfileEditFormModalTestsQuery = {
    readonly response: MyProfileEditFormModalTestsQueryResponse;
    readonly variables: MyProfileEditFormModalTestsQueryVariables;
};



/*
query MyProfileEditFormModalTestsQuery {
  me {
    ...MyProfileEditFormModal_me_2DDXa1
    id
  }
}

fragment MyProfileEditFormModal_me_2DDXa1 on Me {
  bio
  canRequestEmailConfirmation
  email
  icon {
    url(version: "thumbnail")
  }
  identityVerified
  name
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
    "name": "MyProfileEditFormModalTestsQuery",
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
            "args": [
              {
                "kind": "Literal",
                "name": "enableCollectorProfile",
                "value": true
              }
            ],
            "kind": "FragmentSpread",
            "name": "MyProfileEditFormModal_me"
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
    "name": "MyProfileEditFormModalTestsQuery",
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
            "name": "bio",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "canRequestEmailConfirmation",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "email",
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
            "name": "identityVerified",
            "storageKey": null
          },
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
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "4c305c6f3ab0d1c91673fdd97c36630e",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.bio": (v0/*: any*/),
        "me.canRequestEmailConfirmation": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.email": (v0/*: any*/),
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
        "me.identityVerified": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "me.name": (v0/*: any*/)
      }
    },
    "name": "MyProfileEditFormModalTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ce1694871225ea5f97e8b85b526b68bf';
export default node;
