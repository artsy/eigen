/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 61dae8fb35398a15d74734dc9af54e6c */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionUpdateArtworkInput = {
    artistIds?: Array<string | null> | null;
    artworkId: string;
    category?: string | null;
    clientMutationId?: string | null;
    costCurrencyCode?: string | null;
    costMinor?: number | null;
    date?: string | null;
    depth?: string | null;
    editionNumber?: string | null;
    editionSize?: string | null;
    height?: string | null;
    medium?: string | null;
    metric?: string | null;
    title?: string | null;
    width?: string | null;
};
export type MyCollectionArtworkModelUpdateArtworkMutationVariables = {
    input: MyCollectionUpdateArtworkInput;
};
export type MyCollectionArtworkModelUpdateArtworkMutationResponse = {
    readonly myCollectionUpdateArtwork: {
        readonly artworkOrError: {
            readonly artwork?: {
                readonly medium: string | null;
                readonly id: string;
                readonly internalID: string;
                readonly editionNumber: string | null;
                readonly editionSize: string | null;
            } | null;
        } | null;
    } | null;
};
export type MyCollectionArtworkModelUpdateArtworkMutation = {
    readonly response: MyCollectionArtworkModelUpdateArtworkMutationResponse;
    readonly variables: MyCollectionArtworkModelUpdateArtworkMutationVariables;
};



/*
mutation MyCollectionArtworkModelUpdateArtworkMutation(
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
          editionNumber
          editionSize
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
      "concreteType": "Artwork",
      "kind": "LinkedField",
      "name": "artwork",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "medium",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "id",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "internalID",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "editionNumber",
          "storageKey": null
        },
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "editionSize",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "MyCollectionArtworkMutationSuccess",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionUpdateArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionUpdateArtwork",
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
              (v2/*: any*/)
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
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionUpdateArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionUpdateArtwork",
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
              (v2/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "61dae8fb35398a15d74734dc9af54e6c",
    "metadata": {},
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'c1a9a05edb35f618d01d3383aac261d4';
export default node;
