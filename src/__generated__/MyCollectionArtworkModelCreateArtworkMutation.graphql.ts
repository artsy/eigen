/* tslint:disable */
/* eslint-disable */
/* @relayHash fa7f3e5cb2b79a6fe5e01811fe45d43b */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionCreateArtworkInput = {
    artistIds: Array<string | null>;
    category?: string | null;
    clientMutationId?: string | null;
    costCurrencyCode?: string | null;
    costMinor?: number | null;
    date?: string | null;
    depth?: string | null;
    editionNumber?: number | null;
    editionSize?: string | null;
    height?: string | null;
    medium: string;
    metric?: string | null;
    title?: string | null;
    width?: string | null;
};
export type MyCollectionArtworkModelCreateArtworkMutationVariables = {
    input: MyCollectionCreateArtworkInput;
};
export type MyCollectionArtworkModelCreateArtworkMutationResponse = {
    readonly myCollectionCreateArtwork: {
        readonly artworkOrError: {
            readonly artworkEdge?: {
                readonly __id: string;
                readonly node: {
                    readonly artistNames: string | null;
                    readonly medium: string | null;
                    readonly internalID: string;
                    readonly slug: string;
                    readonly editionNumber: string | null;
                    readonly editionSize: string | null;
                } | null;
            } | null;
            readonly mutationError?: {
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type MyCollectionArtworkModelCreateArtworkMutation = {
    readonly response: MyCollectionArtworkModelCreateArtworkMutationResponse;
    readonly variables: MyCollectionArtworkModelCreateArtworkMutationVariables;
};



/*
mutation MyCollectionArtworkModelCreateArtworkMutation(
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
            slug
            editionNumber
            editionSize
            id
          }
        }
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
  "kind": "ScalarField",
  "alias": null,
  "name": "slug",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "editionNumber",
  "args": null,
  "storageKey": null
},
v7 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "editionSize",
  "args": null,
  "storageKey": null
},
v8 = {
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
},
v9 = {
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
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
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
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/)
                        ]
                      },
                      (v8/*: any*/)
                    ]
                  }
                ]
              },
              (v9/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
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
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "id",
                            "args": null,
                            "storageKey": null
                          }
                        ]
                      },
                      (v8/*: any*/)
                    ]
                  }
                ]
              },
              (v9/*: any*/)
            ]
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "mutation",
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
    "id": "5dc3e97a9d6d9f3aa62ed1112330aedc",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '2fd85d12e6759b6310fee89658c2b9d1';
export default node;
