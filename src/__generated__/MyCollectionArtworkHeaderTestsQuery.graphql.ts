/* tslint:disable */
/* eslint-disable */
// @ts-nocheck
/* @relayHash cfa46f75e8c5f546a59b5dc54f77431e */

import { ConcreteRequest } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkHeaderTestsQueryVariables = {};
export type MyCollectionArtworkHeaderTestsQueryResponse = {
    readonly artwork: {
        readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader_artwork">;
    } | null;
};
export type MyCollectionArtworkHeaderTestsQuery = {
    readonly response: MyCollectionArtworkHeaderTestsQueryResponse;
    readonly variables: MyCollectionArtworkHeaderTestsQueryVariables;
};



/*
query MyCollectionArtworkHeaderTestsQuery {
  artwork(id: "some-slug") {
    ...MyCollectionArtworkHeader_artwork
    id
  }
}

fragment ImageCarousel_images on Image {
  url
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

fragment MyCollectionArtworkHeader_artwork on Artwork {
  artistNames
  date
  images {
    ...ImageCarousel_images
    isDefault
    imageURL
    internalID
  }
  internalID
  title
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "some-slug"
  }
],
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v2 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "String"
},
v3 = {
  "enumValues": null,
  "nullable": false,
  "plural": false,
  "type": "ID"
},
v4 = {
  "enumValues": null,
  "nullable": true,
  "plural": false,
  "type": "Int"
};
return {
  "fragment": {
    "argumentDefinitions": [],
    "kind": "Fragment",
    "metadata": null,
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "kind": "LinkedField",
        "name": "artwork",
        "plural": false,
        "selections": [
          {
            "args": null,
            "kind": "FragmentSpread",
            "name": "MyCollectionArtworkHeader_artwork"
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ],
    "type": "Query",
    "abstractKey": null
  },
  "kind": "Request",
  "operation": {
    "argumentDefinitions": [],
    "kind": "Operation",
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "selections": [
      {
        "alias": null,
        "args": (v0/*: any*/),
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
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "url",
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
              },
              {
                "alias": null,
                "args": null,
                "kind": "ScalarField",
                "name": "imageURL",
                "storageKey": null
              },
              (v1/*: any*/)
            ],
            "storageKey": null
          },
          (v1/*: any*/),
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "title",
            "storageKey": null
          },
          {
            "alias": null,
            "args": null,
            "kind": "ScalarField",
            "name": "id",
            "storageKey": null
          }
        ],
        "storageKey": "artwork(id:\"some-slug\")"
      }
    ]
  },
  "params": {
    "id": "cfa46f75e8c5f546a59b5dc54f77431e",
    "metadata": {
      "relayTestingSelectionTypeInfo": {
        "artwork": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Artwork"
        },
        "artwork.artistNames": (v2/*: any*/),
        "artwork.date": (v2/*: any*/),
        "artwork.id": (v3/*: any*/),
        "artwork.images": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "Image"
        },
        "artwork.images.deepZoom": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "DeepZoom"
        },
        "artwork.images.deepZoom.image": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "DeepZoomImage"
        },
        "artwork.images.deepZoom.image.format": (v2/*: any*/),
        "artwork.images.deepZoom.image.size": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "DeepZoomImageSize"
        },
        "artwork.images.deepZoom.image.size.height": (v4/*: any*/),
        "artwork.images.deepZoom.image.size.width": (v4/*: any*/),
        "artwork.images.deepZoom.image.tileSize": (v4/*: any*/),
        "artwork.images.deepZoom.image.url": (v2/*: any*/),
        "artwork.images.height": (v4/*: any*/),
        "artwork.images.imageURL": (v2/*: any*/),
        "artwork.images.imageVersions": {
          "enumValues": null,
          "nullable": true,
          "plural": true,
          "type": "String"
        },
        "artwork.images.internalID": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "ID"
        },
        "artwork.images.isDefault": {
          "enumValues": null,
          "nullable": true,
          "plural": false,
          "type": "Boolean"
        },
        "artwork.images.url": (v2/*: any*/),
        "artwork.images.width": (v4/*: any*/),
        "artwork.internalID": (v3/*: any*/),
        "artwork.title": (v2/*: any*/)
      }
    },
    "name": "MyCollectionArtworkHeaderTestsQuery",
    "operationKind": "query",
    "text": null
  }
};
})();
(node as any).hash = 'f973d28ccb9233e48337c162c0d8daa6';
export default node;
