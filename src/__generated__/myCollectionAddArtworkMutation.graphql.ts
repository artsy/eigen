/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 97b63e1a8509cdd9e85292ce45c08f2b */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
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
    provenance?: string | null;
    title?: string | null;
    width?: string | null;
};
export type myCollectionAddArtworkMutationVariables = {
    input: MyCollectionCreateArtworkInput;
};
export type myCollectionAddArtworkMutationResponse = {
    readonly myCollectionCreateArtwork: {
        readonly artworkOrError: {
            readonly artworkEdge?: {
                readonly __id: string;
                readonly node: {
                    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtwork_sharedProps">;
                } | null;
            } | null;
            readonly mutationError?: {
                readonly message: string | null;
            } | null;
        } | null;
    } | null;
};
export type myCollectionAddArtworkMutation = {
    readonly response: myCollectionAddArtworkMutationResponse;
    readonly variables: myCollectionAddArtworkMutationVariables;
};



/*
mutation myCollectionAddArtworkMutation(
  $input: MyCollectionCreateArtworkInput!
) {
  myCollectionCreateArtwork(input: $input) {
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationSuccess {
        artworkEdge {
          node {
            ...MyCollectionArtwork_sharedProps
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

fragment MyCollectionArtwork_sharedProps on Artwork {
  artist {
    internalID
    id
  }
  artistNames
  category
  costMinor
  costCurrencyCode
  date
  depth
  editionSize
  editionNumber
  height
  id
  images {
    isDefault
    url
    width
    height
  }
  internalID
  medium
  metric
  slug
  title
  width
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
  "type": "MyCollectionArtworkMutationFailure",
  "abstractKey": null
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
  "name": "id",
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "myCollectionAddArtworkMutation",
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
                          {
                            "args": null,
                            "kind": "FragmentSpread",
                            "name": "MyCollectionArtwork_sharedProps"
                          }
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
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
    "name": "myCollectionAddArtworkMutation",
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
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Artist",
                            "kind": "LinkedField",
                            "name": "artist",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v5/*: any*/)
                            ],
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "artistNames",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "category",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "costMinor",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "costCurrencyCode",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "date",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "depth",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "editionSize",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "editionNumber",
                            "storageKey": null
                          },
                          (v6/*: any*/),
                          (v5/*: any*/),
                          {
                            "alias": null,
                            "args": null,
                            "concreteType": "Image",
                            "kind": "LinkedField",
                            "name": "images",
                            "plural": true,
                            "selections": [
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "isDefault",
                                "storageKey": null
                              },
                              {
                                "alias": null,
                                "args": null,
                                "kind": "ScalarField",
                                "name": "url",
                                "storageKey": null
                              },
                              (v7/*: any*/),
                              (v6/*: any*/)
                            ],
                            "storageKey": null
                          },
                          (v4/*: any*/),
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
                            "name": "metric",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "slug",
                            "storageKey": null
                          },
                          {
                            "alias": null,
                            "args": null,
                            "kind": "ScalarField",
                            "name": "title",
                            "storageKey": null
                          },
                          (v7/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v2/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
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
    "id": "97b63e1a8509cdd9e85292ce45c08f2b",
    "metadata": {},
    "name": "myCollectionAddArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '231a9f141a6a07ee4e13bb3443fc0c2e';
export default node;
