/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash 89ad54ea8a2d5f49e0ca3985ba42e171 */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkQueryVariables = {
    artworkSlug: string;
};
export type MyCollectionArtworkQueryResponse = {
    readonly artwork: {
        readonly internalID: string;
        readonly consignmentSubmission: {
            readonly inProgress: boolean | null;
        } | null;
        readonly " $fragmentRefs": FragmentRefs<"NewMyCollectionArtworkHeader_artwork">;
    } | null;
};
export type MyCollectionArtworkQuery = {
    readonly response: MyCollectionArtworkQueryResponse;
    readonly variables: MyCollectionArtworkQueryVariables;
};



/*
query MyCollectionArtworkQuery(
  $artworkSlug: String!
) {
  artwork(id: $artworkSlug) {
    ...NewMyCollectionArtworkHeader_artwork
    internalID
    consignmentSubmission {
      inProgress
    }
    id
  }
}

fragment ImageCarousel_images on Image {
  url: imageURL
  width
  height
  imageVersions
  deepZoom {
    image: Image {
      tileSize: TileSize
      url: Url
      format: Format
      size: Size {
        width: Width
        height: Height
      }
    }
  }
}

fragment NewMyCollectionArtworkHeader_artwork on Artwork {
  artistNames
  date
  images {
    ...ImageCarousel_images
    imageVersions
    isDefault
  }
  internalID
  slug
  title
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "defaultValue": null,
    "kind": "LocalArgument",
    "name": "artworkSlug"
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "artworkSlug"
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
};
return {
  "fragment": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          (v2/*: any*/),
          (v3/*: any*/),
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "NewMyCollectionArtworkHeader_artwork"
          }
        ],
        "storageKey": null
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": (v0/*: any*/),
    "kind": "Operation",
    "name": "MyCollectionArtworkQuery",
    "selections": [
      {
        "alias": null,
        "args": (v1/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
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
            "name": "date",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "concreteType": "Image",
            "kind": "LinkedField",
            "name": "images",
            "plural": true,
            "selections": [
              {
                "alias": "url",
                "args": null,
                "kind": "ScalarField",
                "name": "imageURL",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "width",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "height",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageVersions",
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "concreteType": "DeepZoom",
                "kind": "LinkedField",
                "name": "deepZoom",
                "plural": false,
                "selections": [
                  {
                    "alias": "image",
                    "args": null,
                    "concreteType": "DeepZoomImage",
                    "kind": "LinkedField",
                    "name": "Image",
                    "plural": false,
                    "selections": [
                      {
                        "alias": "tileSize",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "TileSize",
                        "storageKey": null
                      },
                      {
                        "alias": "url",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "Url",
                        "storageKey": null
                      },
                      {
                        "alias": "format",
                        "args": null,
                        "kind": "ScalarField",
                        "name": "Format",
                        "storageKey": null
                      },
                      {
                        "alias": "size",
                        "args": null,
                        "concreteType": "DeepZoomImageSize",
                        "kind": "LinkedField",
                        "name": "Size",
                        "plural": false,
                        "selections": [
                          {
                            "alias": "width",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "Width",
                            "storageKey": null
                          },
                          {
                            "alias": "height",
                            "args": null,
                            "kind": "ScalarField",
                            "name": "Height",
                            "storageKey": null
                          }
                        ],
                        "storageKey": null
                      }
                    ],
                    "storageKey": null
                  }
                ],
                "storageKey": null
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "isDefault",
                "storageKey": null
              }
            ],
            "storageKey": null
          },
          (v2/*: any*/),
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
          (v3/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": null
      }
    ]
  },
  "params": {
    "id": "89ad54ea8a2d5f49e0ca3985ba42e171",
    "metadata": {},
    "name": "MyCollectionArtworkQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = '8b58747cb9ebdb13171da300bee6237d';
export default node;
