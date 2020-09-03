/* tslint:disable */
/* eslint-disable */
/* @relayHash 63f784db6a84c1cd8eb3fd334ab9050c */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionUpdateArtworkInput = {
    artistIds?: Array<string | null> | null;
    artworkId: string;
    clientMutationId?: string | null;
    date?: string | null;
    depth?: string | null;
    height?: string | null;
    medium?: string | null;
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
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
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
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
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
    "name": "MyCollectionArtworkModelUpdateArtworkMutation",
    "id": "863d4d31b6cbe0096b63432387b2e069",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'e469f0ec5892608703eddd6467a77489';
export default node;
