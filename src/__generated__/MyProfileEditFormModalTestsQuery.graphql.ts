/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 9c89bd1ab1fd629262ed2f3278f45cb8 */

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
  name
  profession
  otherRelevantPositions
  bio
  location {
    display
    city
    state
    country
    id
  }
  icon {
    url(version: "thumbnail")
  }
  email
  identityVerified
  canRequestEmailConfirmation
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v1 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v2 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "profession",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "otherRelevantPositions",
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
            "concreteType": "MyLocation",
            "kind": "LinkedField",
            "name": "location",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "display",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "city",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "state",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "country",
                "storageKey": null
              },
              (v0/*: any*/)
            ],
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
            "name": "email",
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
            "name": "canRequestEmailConfirmation",
            "storageKey": null
          },
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "9c89bd1ab1fd629262ed2f3278f45cb8",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "me": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Me"
        },
        "me.bio": (v1/*: any*/),
        "me.canRequestEmailConfirmation": {
          "enumValues": null,
          "nullable": false,
          "plural": false,
          "type": "Boolean"
        },
        "me.email": (v1/*: any*/),
        "me.icon": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Image"
        },
        "me.icon.url": (v1/*: any*/),
        "me.id": (v2/*: any*/),
        "me.identityVerified": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "me.location": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "MyLocation"
        },
        "me.location.city": (v1/*: any*/),
        "me.location.country": (v1/*: any*/),
        "me.location.display": (v1/*: any*/),
        "me.location.id": (v2/*: any*/),
        "me.location.state": (v1/*: any*/),
        "me.name": (v1/*: any*/),
        "me.otherRelevantPositions": (v1/*: any*/),
        "me.profession": (v1/*: any*/)
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
