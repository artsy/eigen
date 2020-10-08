/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 631f1278ada3ae3314da587d494402ce */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionDeleteArtworkInput = {
    artworkId: string;
    clientMutationId?: string | null;
};
export type MyCollectionArtworkModelDeleteArtworkMutationVariables = {
    input: MyCollectionDeleteArtworkInput;
};
export type MyCollectionArtworkModelDeleteArtworkMutationResponse = {
    readonly myCollectionDeleteArtwork: {
        readonly artworkOrError: {
            readonly success?: boolean | null;
            readonly mutationError?: {
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type MyCollectionArtworkModelDeleteArtworkMutation = {
    readonly response: MyCollectionArtworkModelDeleteArtworkMutationResponse;
    readonly variables: MyCollectionArtworkModelDeleteArtworkMutationVariables;
};



/*
mutation MyCollectionArtworkModelDeleteArtworkMutation(
  $input: MyCollectionDeleteArtworkInput!
) {
  myCollectionDeleteArtwork(input: $input) {
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationDeleteSuccess {
        success
      }
      ... on MyCollectionArtworkMutationFailure {
        mutationError {
          message
        }
      }
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "input",
    "variableName": "input"
  }
],
v2 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "success",
      "storageKey": null
    }
  ],
  "type": "MyCollectionArtworkMutationDeleteSuccess",
  "abstractKey": null
},
v3 = {
  "kind": "InlineFragment",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "kind": "LinkedField",
      "name": "mutationError",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "message",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MyCollectionArtworkMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionDeleteArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionDeleteArtwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "artworkOrError",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionDeleteArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionDeleteArtwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "concreteType": null,
            "kind": "LinkedField",
            "name": "artworkOrError",
            "plural": false,
            "selections": [
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "__typename",
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "631f1278ada3ae3314da587d494402ce",
    "metadata": {},
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '39be118c6f08d5fe7545d0a27b5b7900';
export default node;
