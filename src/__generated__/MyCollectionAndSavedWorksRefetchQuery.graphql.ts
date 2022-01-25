/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 436b1ca090cb7b959d9d3027c1b71399 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorksRefetchQueryVariables = {
    enableCollectorProfile: boolean;
};
export type MyCollectionAndSavedWorksRefetchQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
    } | null;
};
export type MyCollectionAndSavedWorksRefetchQuery = {
    readonly response: MyCollectionAndSavedWorksRefetchQueryResponse;
    readonly variables: MyCollectionAndSavedWorksRefetchQueryVariables;
};



/*
query MyCollectionAndSavedWorksRefetchQuery(
  $enableCollectorProfile: Boolean!
) {
  me {
    ...MyProfileEditFormModal_me_3CllfQ
    id
  }
}

fragment MyProfileEditFormModal_me_3CllfQ on Me {
  bio
  canRequestEmailConfirmation @include(if: $enableCollectorProfile)
  email @include(if: $enableCollectorProfile)
  identityVerified @include(if: $enableCollectorProfile)
  icon {
    url(version: "thumbnail")
  }
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "enableCollectorProfile"
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionAndSavedWorksRefetchQuery",
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
                "kind": "Variable",
                "name": "enableCollectorProfile",
                "variableName": "enableCollectorProfile"
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionAndSavedWorksRefetchQuery",
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
            "name": "name",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "condition": "enableCollectorProfile",
            "kind": "Condition",
            "passingValue": true,
            "selections": [
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
                "kind": "ScalarField",
                "name": "identityVerified",
                "storageKey": null
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "436b1ca090cb7b959d9d3027c1b71399",
    "metadata": {},
    "name": "MyCollectionAndSavedWorksRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'a31d04f6880ecff904c251ffb0eb117d';
export default node;
