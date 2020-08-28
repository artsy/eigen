/* tslint:disable */
/* eslint-disable */
/* @relayHash 5bfbf61403ee10d718964f54c5895afd */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionUpdateArtworkInput = {
    artistIds?: Array<string | null> | null;
    artworkId: string;
    clientMutationId?: string | null;
    dimensions?: string | null;
    medium?: string | null;
    title?: string | null;
    year?: string | null;
};
export type MyCollectionUpdateArtworkMutationVariables = {
    input: MyCollectionUpdateArtworkInput;
};
export type MyCollectionUpdateArtworkMutationResponse = {
    readonly myCollectionUpdateArtwork: {
        readonly artworkOrError: {
            readonly artwork?: {
                readonly medium: string | null;
                readonly id: string;
                readonly internalID: string;
            } | null;
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
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationSuccess {
        artwork {
          medium
          id
          internalID
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
    "type": "MyCollectionUpdateArtworkInput!",
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
  "type": "MyCollectionArtworkMutationSuccess",
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
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionUpdateArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionUpdateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionUpdateArtworkPayload",
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
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionUpdateArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionUpdateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionUpdateArtworkPayload",
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
              (v2/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionUpdateArtworkMutation",
    "id": "17ec637dbb20bb528d62b1e2bee44693",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '664a26ca036bebcc90d79efec7d62eef';
export default node;
