/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 5dc3e97a9d6d9f3aa62ed1112330aedc */

import { ConcreteRequest } from "relay-runtime";
export type MyCollectionCreateArtworkInput = {
    artistIds: Array<string | null>;
    category?: string | null;
    clientMutationId?: string | null;
    costCurrencyCode?: string | null;
    costMinor?: number | null;
    date?: string | null;
    depth?: string | null;
    editionNumber?: string | null;
    editionSize?: string | null;
    externalImageUrls?: Array<string | null> | null;
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
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionNumber",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionSize",
  "storageKey": null
},
v8 = {
  "kind": "ClientExtension",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "__id",
      "storageKey": null
    }
  ]
},
v9 = {
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
  "type": "MyCollectionArtworkMutationFailure",
  "abstractKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionCreateArtwork",
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
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "kind": "LinkedField",
                    "name": "artworkEdge",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v9/*: any*/)
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
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "MyCollectionCreateArtworkPayload",
        "kind": "LinkedField",
        "name": "myCollectionCreateArtwork",
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
              {
                "kind": "InlineFragment",
                "selections": [
                  {
                    "alias": null,
                    "args": null,
                    "concreteType": "MyCollectionEdge",
                    "kind": "LinkedField",
                    "name": "artworkEdge",
                    "plural": false,
                    "selections": [
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "Artwork",
                        "kind": "LinkedField",
                        "name": "node",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          (v5/*: any*/),
                          (v6/*: any*/),
                          (v7/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "id",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      },
                      (v8/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v9/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "5dc3e97a9d6d9f3aa62ed1112330aedc",
    "metadata": {},
    "name": "MyCollectionArtworkModelCreateArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '2fd85d12e6759b6310fee89658c2b9d1';
export default node;
