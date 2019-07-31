/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
export type SaveArtworkInput = {
    readonly artworkID?: string | null;
    readonly remove?: boolean | null;
    readonly clientMutationId?: string | null;
};
export type ArtworkActionsSaveMutationVariables = {
    readonly input: SaveArtworkInput;
};
export type ArtworkActionsSaveMutationResponse = {
    readonly saveArtwork: {
        readonly artwork: {
            readonly id: string;
            readonly is_saved: boolean | null;
        } | null;
    } | null;
};
export type ArtworkActionsSaveMutation = {
    readonly response: ArtworkActionsSaveMutationResponse;
    readonly variables: ArtworkActionsSaveMutationVariables;
};



/*
mutation ArtworkActionsSaveMutation(
  $input: SaveArtworkInput!
) {
  saveArtwork(input: $input) {
    artwork {
      id
      is_saved: isSaved
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "SaveArtworkInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "saveArtwork",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SaveArtworkPayload",
    "plural": false,
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": null,
        "args": null,
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": "is_saved",
            "name": "isSaved",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ArtworkActionsSaveMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "ArtworkActionsSaveMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "ArtworkActionsSaveMutation",
    "id": "5177deeca0d7ff411ca8c5807f3e8618",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '6d2defeccf752edd1928ff070c2a253f';
export default node;
