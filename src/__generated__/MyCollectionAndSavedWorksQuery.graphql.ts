/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
/* @relayHash 1d9a233da97db962eee57413cc3f13fc */
>>>>>>> 8284d04a6e (add tests)
=======
/* @relayHash 1ad0b13d40c215504e72045918f4e71a */
>>>>>>> 8ad8e5aa5e (fix merge conflicts)

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorksQueryVariables = {};
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
query MyCollectionAndSavedWorksQuery {
  me @optionalField {
    ...MyCollectionAndSavedWorks_me
    id
  }
}

fragment MyCollectionAndSavedWorks_me on Me {
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
  ...MyProfileEditFormModal_me_40LmUp
}

<<<<<<< HEAD
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
=======
fragment MyProfileEditFormModal_me_40LmUp on Me {
  bio
>>>>>>> 8ad8e5aa5e (fix merge conflicts)
  icon {
    url(version: "thumbnail")
  }
  name
}
*/

const node: ConcreteRequest = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": [],
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
=======
              (v0/*: any*/)
>>>>>>> 8ad8e5aa5e (fix merge conflicts)
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
          (v0/*: any*/)
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
<<<<<<< HEAD
<<<<<<< HEAD
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
=======
    "id": "1d9a233da97db962eee57413cc3f13fc",
>>>>>>> 8284d04a6e (add tests)
=======
    "id": "1ad0b13d40c215504e72045918f4e71a",
>>>>>>> 8ad8e5aa5e (fix merge conflicts)
    "metadata": {},
    "name": "MyCollectionAndSavedWorksQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'e2528a0edab35bb34cd3e89a63547d21';
export default node;
