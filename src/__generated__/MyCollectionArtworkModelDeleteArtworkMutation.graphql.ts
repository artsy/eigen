/* tslint:disable */
/* eslint-disable */
/* @relayHash 8249159d53b265aabbb9b99009ea6ccc */

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
    "kind": "LocalArgument",
    "name": "input",
    "type": "MyCollectionDeleteArtworkInput!",
    "defaultValue": null
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
  "type": "MyCollectionArtworkMutationDeleteSuccess",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "success",
      "args": null,
      "storageKey": null
    }
  ]
},
v3 = {
  "kind": "InlineFragment",
  "type": "MyCollectionArtworkMutationFailure",
  "selections": [
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "mutationError",
      "storageKey": null,
      "args": null,
      "concreteType": "GravityMutationError",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "message",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionDeleteArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionDeleteArtworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworkOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionDeleteArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionDeleteArtworkPayload",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "artworkOrError",
            "storageKey": null,
            "args": null,
            "concreteType": null,
            "plural": false,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "__typename",
                "args": null,
                "storageKey": null
              },
              (v2/*: any*/),
              (v3/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionArtworkModelDeleteArtworkMutation",
    "id": "631f1278ada3ae3314da587d494402ce",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '39be118c6f08d5fe7545d0a27b5b7900';
export default node;
