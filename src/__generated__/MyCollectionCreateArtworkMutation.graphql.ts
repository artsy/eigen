/* tslint:disable */
/* eslint-disable */
/* @relayHash 3315d965299df2339047704e6929ed46 */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionCreateArtworkInput = {
    artistIds: Array<string | null>;
    clientMutationId?: string | null;
    dimensions: string;
    medium: string;
    title?: string | null;
    year?: string | null;
};
export type MyCollectionCreateArtworkMutationVariables = {
    input: MyCollectionCreateArtworkInput;
};
export type MyCollectionCreateArtworkMutationResponse = {
    readonly myCollectionCreateArtwork: {
        readonly artworkOrError: {
            readonly artworkEdge?: {
                readonly __id: string;
                readonly node: {
                    readonly artistNames: string | null;
                    readonly medium: string | null;
                    readonly internalID: string;
                } | null;
            } | null;
        } | null;
    } | null;
};
export type MyCollectionCreateArtworkMutation = {
    readonly response: MyCollectionCreateArtworkMutationResponse;
    readonly variables: MyCollectionCreateArtworkMutationVariables;
};



/*
mutation MyCollectionCreateArtworkMutation(
  $input: MyCollectionCreateArtworkInput!
) {
  myCollectionCreateArtwork(input: $input) {
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationSuccess {
        artworkEdge {
          node {
            artistNames
            medium
            internalID
            id
          }
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
    "type": "MyCollectionCreateArtworkInput!",
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
  "kind": "ScalarField",
  "alias": null,
  "name": "artistNames",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "medium",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    }
  ]
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MyCollectionCreateArtworkMutation",
    "type": "Mutation",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionCreateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
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
                "kind": "InlineFragment",
                "type": "MyCollectionArtworkMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworkEdge",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/)
                        ]
                      },
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionCreateArtworkMutation",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "myCollectionCreateArtwork",
        "storageKey": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
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
              {
                "kind": "InlineFragment",
                "type": "MyCollectionArtworkMutationSuccess",
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "artworkEdge",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v5/*: any*/)
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionCreateArtworkMutation",
    "id": "690061e15d610d4bab5065badb715dc4",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = 'eef0bae9f969e79ab5a066d246b88ef9';
export default node;
