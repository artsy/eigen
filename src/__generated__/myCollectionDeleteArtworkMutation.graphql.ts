/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash a4c6feed6074e0a2687410700d85f303 */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionDeleteArtworkInput = {
    artworkId: string;
    clientMutationId?: string | null;
};
export type myCollectionDeleteArtworkMutationVariables = {
    input: MyCollectionDeleteArtworkInput;
};
export type myCollectionDeleteArtworkMutationResponse = {
    readonly myCollectionDeleteArtwork: {
        readonly artworkOrError: {
            readonly success?: boolean | null;
            readonly mutationError?: {
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type myCollectionDeleteArtworkMutation = {
    readonly response: myCollectionDeleteArtworkMutationResponse;
    readonly variables: myCollectionDeleteArtworkMutationVariables;
};



/*
mutation myCollectionDeleteArtworkMutation(
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
    "name": "myCollectionDeleteArtworkMutation",
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
    "name": "myCollectionDeleteArtworkMutation",
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
    "id": "a4c6feed6074e0a2687410700d85f303",
    "metadata": {},
    "name": "myCollectionDeleteArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '9bf328c100be019ca7da7d3227d14065';
export default node;
