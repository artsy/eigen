/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c8f8ec3b94988246b66f595fdf3f1402 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfileQueryVariables = {};
export type MyProfileQueryResponse = {
    readonly me: {
        readonly " $fragmentRefs": FragmentRefs<"MyProfileHeaderMyCollectionAndSavedWorks_me" | "MyProfile_me">;
    } | null;
};
export type MyProfileQuery = {
    readonly response: MyProfileQueryResponse;
    readonly variables: MyProfileQueryVariables;
};



/*
query MyProfileQuery {
  me @optionalField {
    ...MyProfileHeaderMyCollectionAndSavedWorks_me
    ...MyProfile_me
    id
  }
}

fragment MyProfileEditFormModal_me on Me {
  name
  bio
  icon {
    url(version: "thumbnail")
  }
}

fragment MyProfileEditForm_me on Me {
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
}

fragment MyProfileHeaderMyCollectionAndSavedWorks_me on Me {
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
  ...MyProfileEditFormModal_me
}

fragment MyProfile_me on Me {
  name
  bio
  icon {
    url(version: "thumbnail")
  }
  ...MyProfileHeaderMyCollectionAndSavedWorks_me
  ...MyProfileEditForm_me
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
    "name": "MyProfileQuery",
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
            "name": "MyProfileHeaderMyCollectionAndSavedWorks_me"
          },
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyProfile_me"
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
    "name": "MyProfileQuery",
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
    "id": "c8f8ec3b94988246b66f595fdf3f1402",
    "metadata": {},
    "name": "MyProfileQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'ac090279e66d810e376ad9c091fc8cba';
export default node;
