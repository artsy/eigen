/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash d67795adeab589b05eac5375abf95983 */

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
  name
  profession @include(if: $enableCollectorProfile)
  otherRelevantPositions @include(if: $enableCollectorProfile)
  location @include(if: $enableCollectorProfile) {
    display
    city
    state
    country
    id
  }
  email @include(if: $enableCollectorProfile)
  emailConfirmed @include(if: $enableCollectorProfile)
  identityVerified @include(if: $enableCollectorProfile)
  canRequestEmailConfirmation @include(if: $enableCollectorProfile)
  bio
  icon {
    url(version: "thumbnail")
  }
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
                  (v1/*: any*/)
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
                "name": "emailConfirmed",
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
              }
            ]
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "d67795adeab589b05eac5375abf95983",
    "metadata": {},
    "name": "MyCollectionAndSavedWorksRefetchQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'a31d04f6880ecff904c251ffb0eb117d';
export default node;
