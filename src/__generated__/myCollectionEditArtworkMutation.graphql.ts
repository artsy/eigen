/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash c44497c5e7ae909f79edcf40fd858a9d */

import { ConcreteRequest } from "relay-runtime";
export type ArtworkAttributionClassType = "LIMITED_EDITION" | "OPEN_EDITION" | "UNIQUE" | "UNKNOWN_EDITION" | "%future added value";
export type MyCollectionUpdateArtworkInput = {
    artistIds?: Array<string | null> | null | undefined;
    artworkId: string;
    artworkLocation?: string | null | undefined;
    attributionClass?: ArtworkAttributionClassType | null | undefined;
    category?: string | null | undefined;
    clientMutationId?: string | null | undefined;
    costCurrencyCode?: string | null | undefined;
    costMinor?: number | null | undefined;
    date?: string | null | undefined;
    depth?: string | null | undefined;
    editionNumber?: string | null | undefined;
    editionSize?: string | null | undefined;
    externalImageUrls?: Array<string | null> | null | undefined;
    height?: string | null | undefined;
    isEdition?: boolean | null | undefined;
    medium?: string | null | undefined;
    metric?: string | null | undefined;
    pricePaidCents?: number | null | undefined;
    pricePaidCurrency?: string | null | undefined;
    provenance?: string | null | undefined;
    title: string;
    width?: string | null | undefined;
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
                    readonly formattedNationalityAndBirthday: string | null;
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
                readonly attributionClass: {
                    readonly name: string | null;
                } | null;
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
                readonly artworkLocation: string | null;
                readonly provenance: string | null;
                readonly slug: string;
                readonly title: string | null;
                readonly width: string | null;
                readonly consignmentSubmission: {
                    readonly inProgress: boolean | null;
                } | null;
            } | null | undefined;
            readonly mutationError?: {
                readonly message: string;
            } | null | undefined;
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
            formattedNationalityAndBirthday
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
          attributionClass {
            name
            id
          }
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
          artworkLocation
          provenance
          slug
          title
          width
          consignmentSubmission {
            inProgress
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
  "name": "internalID",
  "storageKey": null
},
v3 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "formattedNationalityAndBirthday",
  "storageKey": null
},
v4 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artistNames",
  "storageKey": null
},
v5 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "category",
  "storageKey": null
},
v6 = {
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
v7 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "date",
  "storageKey": null
},
v8 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "depth",
  "storageKey": null
},
v9 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionSize",
  "storageKey": null
},
v10 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "editionNumber",
  "storageKey": null
},
v11 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v12 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "name",
  "storageKey": null
},
v13 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "id",
  "storageKey": null
},
v14 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
},
v15 = {
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
    (v14/*: any*/),
    (v11/*: any*/),
    (v2/*: any*/)
  ],
  "storageKey": null
},
v16 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "isEdition",
  "storageKey": null
},
v17 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "medium",
  "storageKey": null
},
v18 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "metric",
  "storageKey": null
},
v19 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "artworkLocation",
  "storageKey": null
},
v20 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "provenance",
  "storageKey": null
},
v21 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "slug",
  "storageKey": null
},
v22 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "title",
  "storageKey": null
},
v23 = {
  "alias": null,
  "args": null,
  "concreteType": "ArtworkConsignmentSubmission",
  "kind": "LinkedField",
  "name": "consignmentSubmission",
  "plural": false,
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "inProgress",
      "storageKey": null
    }
  ],
  "storageKey": null
},
v24 = {
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
                          (v2/*: any*/),
                          (v3/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AttributionClass",
                        "kind": "LinkedField",
                        "name": "attributionClass",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/),
                      (v15/*: any*/),
                      (v2/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v14/*: any*/),
                      (v23/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v24/*: any*/)
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
                          (v3/*: any*/),
                          (v13/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v4/*: any*/),
                      (v5/*: any*/),
                      (v6/*: any*/),
                      (v7/*: any*/),
                      (v8/*: any*/),
                      (v9/*: any*/),
                      (v10/*: any*/),
                      (v11/*: any*/),
                      {
                        "alias": null,
                        "args": null,
                        "concreteType": "AttributionClass",
                        "kind": "LinkedField",
                        "name": "attributionClass",
                        "plural": false,
                        "selections": [
                          (v12/*: any*/),
                          (v13/*: any*/)
                        ],
                        "storageKey": null
                      },
                      (v13/*: any*/),
                      (v15/*: any*/),
                      (v2/*: any*/),
                      (v16/*: any*/),
                      (v17/*: any*/),
                      (v18/*: any*/),
                      (v19/*: any*/),
                      (v20/*: any*/),
                      (v21/*: any*/),
                      (v22/*: any*/),
                      (v14/*: any*/),
                      (v23/*: any*/)
                    ],
                    "storageKey": null
                  }
                ],
                "type": "MyCollectionArtworkMutationSuccess",
                "abstractKey": null
              },
              (v24/*: any*/)
            ],
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "c44497c5e7ae909f79edcf40fd858a9d",
    "metadata": {},
    "name": "myCollectionEditArtworkMutation",
    "operationKind": "mutation",
    "text": null
  }
};
})();
(node as any).hash = '693e3eb404700ca73785a1824f7aa074';
export default node;
