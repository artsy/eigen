/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5177deeca0d7ff411ca8c5807f3e8618 */

import { ConcreteRequest } from "relay-runtime";
export type SaveArtworkInput = {
    artworkID?: string | null;
    clientMutationId?: string | null;
    remove?: boolean | null;
};
export type ArtworkActionsSaveMutationVariables = {
    input: SaveArtworkInput;
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
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "input"
  }
],
v1 = [
  {
    "alias": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "SaveArtworkPayload",
    "kind": "LinkedField",
    "name": "saveArtwork",
    "plural": false,
    "selections": [
      {
        "alias": null,
        "args": null,
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          },
          {
            "alias": "is_saved",
            "args": null,
            "kind": "ScalarField",
            "name": "isSaved",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ],
    "storageKey": null
  }
];
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "ArtworkActionsSaveMutation",
    "selections": (v1/*: any*/),
    "type": "Mutation",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "ArtworkActionsSaveMutation",
    "selections": (v1/*: any*/)
  },
  "params": {
    "id": "5177deeca0d7ff411ca8c5807f3e8618",
    "metadata": {},
    "name": "ArtworkActionsSaveMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '6d2defeccf752edd1928ff070c2a253f';
export default node;
