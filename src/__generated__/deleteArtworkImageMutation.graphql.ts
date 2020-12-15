/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 854ac8c3284aad4a8809acda88014a4e */

import { ConcreteRequest } from "relay-runtime";
export type DeleteArtworkImageInput = {
    artworkID: string;
    clientMutationId?: string | null;
    imageID: string;
};
export type deleteArtworkImageMutationVariables = {
    input: DeleteArtworkImageInput;
};
export type deleteArtworkImageMutationResponse = {
    readonly deleteArtworkImage: {
        readonly artworkOrError: {
            readonly success?: boolean | null;
            readonly mutationError?: {
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type deleteArtworkImageMutation = {
    readonly response: deleteArtworkImageMutationResponse;
    readonly variables: deleteArtworkImageMutationVariables;
};



/*
mutation deleteArtworkImageMutation(
  $input: DeleteArtworkImageInput!
) {
  deleteArtworkImage(input: $input) {
    artworkOrError {
      __typename
      ... on ArtworkMutationDeleteSuccess {
        success
      }
      ... on ArtworkMutationFailure {
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
  "type": "ArtworkMutationDeleteSuccess",
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
  "type": "ArtworkMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "deleteArtworkImageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteArtworkImagePayload",
        "kind": "LinkedField",
        "name": "deleteArtworkImage",
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
    "name": "deleteArtworkImageMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "DeleteArtworkImagePayload",
        "kind": "LinkedField",
        "name": "deleteArtworkImage",
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
    "id": "854ac8c3284aad4a8809acda88014a4e",
    "metadata": {},
    "name": "deleteArtworkImageMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c33e37969514a50e996505a811a463d5';
export default node;
