/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 2708169682fe340853a55727c7774bca */

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
    externalImageUrls?: Array<string | null> | null;
    height?: string | null;
    isEdition?: boolean | null;
    medium?: string | null;
    metric?: string | null;
    pricePaidCents?: number | null;
    pricePaidCurrency?: string | null;
    provenance?: string | null;
    title?: string | null;
    width?: string | null;
};
export type myCollectionEditArtworkMutationVariables = {
    input: MyCollectionUpdateArtworkInput;
};
export type myCollectionEditArtworkMutationResponse = {
    readonly myCollectionUpdateArtwork: {
        readonly artworkOrError: {
            readonly artwork?: {
                readonly artist: {
                    readonly internalID: string;
                } | null;
                readonly artistNames: string | null;
                readonly category: string | null;
                readonly pricePaid: {
                    readonly display: string | null;
                    readonly minor: number;
                    readonly currencyCode: string;
                } | null;
                readonly date: string | null;
                readonly depth: string | null;
                readonly editionSize: string | null;
                readonly editionNumber: string | null;
                readonly height: string | null;
                readonly id: string;
                readonly images: ReadonlyArray<{
                    readonly isDefault: boolean | null;
                    readonly imageURL: string | null;
                    readonly width: number | null;
                    readonly height: number | null;
                    readonly internalID: string | null;
                } | null> | null;
                readonly internalID: string;
                readonly isEdition: boolean | null;
                readonly medium: string | null;
                readonly metric: string | null;
                readonly provenance: string | null;
                readonly slug: string;
                readonly title: string | null;
                readonly width: string | null;
            } | null;
            readonly mutationError?: {
                readonly message: string;
            } | null;
        } | null;
    } | null;
};
export type myCollectionEditArtworkMutation = {
    readonly response: myCollectionEditArtworkMutationResponse;
    readonly variables: myCollectionEditArtworkMutationVariables;
};



/*
mutation myCollectionEditArtworkMutation(
  $input: MyCollectionUpdateArtworkInput!
) {
  myCollectionUpdateArtwork(input: $input) {
    artworkOrError {
      __typename
      ... on MyCollectionArtworkMutationSuccess {
        artwork {
          artist {
            internalID
            id
          }
          artistNames
          category
          pricePaid {
            display
            minor
            currencyCode
          }
          date
          depth
          editionSize
          editionNumber
          height
          id
          images {
            isDefault
            imageURL
            width
            height
            internalID
          }
          internalID
          isEdition
          medium
          metric
          provenance
          slug
          title
          width
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
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "concreteType": "Money",
  "kind": "LinkedField",
  "name": "pricePaid",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "display",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "minor",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "currencyCode",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v6 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "depth",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionSize",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionNumber",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v13 = {
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
      "name": "imageURL",
      "storageKey": null
    },
    (v12/*: any*/),
    (v10/*: any*/),
    (v2/*: any*/)
  ],
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEdition",
  "storageKey": null
},
v15 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provenance",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v20 = {
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
    "name": "myCollectionEditArtworkMutation",
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
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v13/*: any*/),
                      (v2/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v20/*: any*/)
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
    "name": "myCollectionEditArtworkMutation",
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
              {
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
                        "concreteType": "Artist",
                        "kind": "LinkedField",
                        "name": "artist",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          (v11/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v3/*: any*/),
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      (v13/*: any*/),
                      (v2/*: any*/),
                      (v14/*: any*/),
                      (v15/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v12/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v20/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "2708169682fe340853a55727c7774bca",
    "metadata": {},
    "name": "myCollectionEditArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = 'ac36cc5f8f9d7a1de5663c3fd2816586';
export default node;
