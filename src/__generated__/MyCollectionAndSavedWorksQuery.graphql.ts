/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
<<<<<<< HEAD
<<<<<<< HEAD
/* @relayHash f1edc159ab605a68cb8b1e7d7eb79c9f */
=======
/* @relayHash b088d1289ffcba232f80baa277f03144 */
>>>>>>> 0ac07c6c97 (add profile verification methods)
=======
/* @relayHash b088d1289ffcba232f80baa277f03144 */
=======
<<<<<<< HEAD
<<<<<<< HEAD
/* @relayHash 83152c6de36b76dce0613b7a5afce5a2 */
=======
/* @relayHash f2a6335131b742baf833d2a19c44611c */
>>>>>>> 6f81cd6a42 (add profile verification methods)
=======
/* @relayHash f2a6335131b742baf833d2a19c44611c */
=======
/* @relayHash c1788367c3492bd8fbb3b802b8e6939c */
>>>>>>> 2db50a06fb (send verification email on verify press)
>>>>>>> 157b1cc5be (send verification email on verify press)
>>>>>>> bf16f44883 (send verification email on verify press)
>>>>>>> 52000b447e (send verification email on verify press)

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorksQueryVariables = {
    enableCollectorProfile: boolean;
};
export type MyCollectionAndSavedWorksQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me">;
    } | null;
};
export type MyCollectionAndSavedWorksQuery = {
    readonly response: MyCollectionAndSavedWorksQueryResponse;
    readonly variables: MyCollectionAndSavedWorksQueryVariables;
};



/*
query MyCollectionAndSavedWorksQuery(
  $enableCollectorProfile: Boolean!
) {
  me @optionalField {
    ...MyCollectionAndSavedWorks_me_3CllfQ
    id
  }
}

fragment MyCollectionAndSavedWorks_me_3CllfQ on Me {
  name
  bio
  location {
    display
    id
  }
  otherRelevantPositions
  profession
  icon {
    url(version: "thumbnail")
  }
  createdAt
  ...MyProfileEditFormModal_me_3CllfQ
}

fragment MyProfileEditFormModal_me_3CllfQ on Me {
<<<<<<< HEAD
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
=======
  bio
  canRequestEmailConfirmation @include(if: $enableCollectorProfile)
  email @include(if: $enableCollectorProfile)
  identityVerified @include(if: $enableCollectorProfile)
>>>>>>> 52000b447e (send verification email on verify press)
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
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionAndSavedWorksQuery",
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
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionAndSavedWorksQuery",
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
<<<<<<< HEAD
              (v0/*: any*/),
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
              }
=======
              (v1/*: any*/)
>>>>>>> 0ac07c6c97 (add profile verification methods)
            ],
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
            "name": "profession",
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
          (v1/*: any*/),
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
<<<<<<< HEAD
<<<<<<< HEAD
    "id": "f1edc159ab605a68cb8b1e7d7eb79c9f",
=======
    "id": "b088d1289ffcba232f80baa277f03144",
>>>>>>> 0ac07c6c97 (add profile verification methods)
=======
    "id": "b088d1289ffcba232f80baa277f03144",
=======
<<<<<<< HEAD
<<<<<<< HEAD
    "id": "83152c6de36b76dce0613b7a5afce5a2",
=======
    "id": "f2a6335131b742baf833d2a19c44611c",
>>>>>>> 6f81cd6a42 (add profile verification methods)
=======
    "id": "f2a6335131b742baf833d2a19c44611c",
=======
    "id": "c1788367c3492bd8fbb3b802b8e6939c",
>>>>>>> 2db50a06fb (send verification email on verify press)
>>>>>>> 157b1cc5be (send verification email on verify press)
>>>>>>> bf16f44883 (send verification email on verify press)
>>>>>>> 52000b447e (send verification email on verify press)
    "metadata": {},
    "name": "MyCollectionAndSavedWorksQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'd127f9d668c0f4e07494a43a1e189dfa';
export default node;
