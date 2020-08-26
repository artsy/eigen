/* tslint:disable */
/* eslint-disable */
/* @relayHash b6b55aa6e8816f57e3e4bf0ee8df6b5f */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionUpdateArtworkInput = {
    artistIds?: Array<string | null> | null;
    artworkId: string;
    clientMutationId?: string | null;
    dimensions?: string | null;
    medium?: string | null;
};
export type MyCollectionUpdateArtworkMutationVariables = {
    input: MyCollectionUpdateArtworkInput;
};
export type MyCollectionUpdateArtworkMutationResponse = {
    readonly myCollectionUpdateArtwork: {
        readonly artwork: {
            readonly medium: string | null;
            readonly id: string;
            readonly internalID: string;
        } | null;
    } | null;
};
export type MyCollectionUpdateArtworkMutation = {
    readonly response: MyCollectionUpdateArtworkMutationResponse;
    readonly variables: MyCollectionUpdateArtworkMutationVariables;
};



/*
mutation MyCollectionUpdateArtworkMutation(
  $input: MyCollectionUpdateArtworkInput!
) {
  myCollectionUpdateArtwork(input: $input) {
    artwork {
      medium
      id
      internalID
    }
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "input",
    "type": "MyCollectionUpdateArtworkInput!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "LinkedField",
    "alias": null,
    "name": "myCollectionUpdateArtwork",
    "storageKey": null,
    "args": [
      {
        "kind": "Variable",
        "name": "input",
        "variableName": "input"
      }
    ],
    "concreteType": "MyCollectionUpdateArtworkPayload",
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
            "name": "medium",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "internalID",
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
    "name": "MyCollectionUpdateArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionUpdateArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": (v1/*: any*/)
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionUpdateArtworkMutation",
    "id": "0635a9441b02b3c753d7de2cbbfbc616",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '040c9ea6681a0773a754c5a75139dd06';
export default node;
