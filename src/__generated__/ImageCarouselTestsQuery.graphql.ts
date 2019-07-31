/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ImageCarousel_images$ref } from "./ImageCarousel_images.graphql";
export type ImageCarouselTestsQueryVariables = {};
export type ImageCarouselTestsQueryResponse = {
    readonly artwork: {
        readonly images: ReadonlyArray<{
            readonly " $fragmentRefs": ImageCarousel_images$ref;
        } | null> | null;
    } | null;
};
export type ImageCarouselTestsQuery = {
    readonly response: ImageCarouselTestsQueryResponse;
    readonly variables: ImageCarouselTestsQueryVariables;
};



/*
query ImageCarouselTestsQuery {
  artwork(id: "unused") {
    images {
      ...ImageCarousel_images
    }
    id
  }
}

fragment ImageCarousel_images on Image {
  image_url: imageURL
  width
  height
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "unused"
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ImageCarouselTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "ImageCarousel_images",
                "args": null
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "ImageCarouselTestsQuery",
    "argumentDefinitions": [],
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v0/*: any*/),
        "concreteType": "Artwork",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "images",
            "storageKey": null,
            "args": null,
            "concreteType": "Image",
            "plural": true,
            "selections": [
              {
                "kind": "ScalarField",
                "alias": "image_url",
                "name": "imageURL",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "width",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "height",
                "args": null,
                "storageKey": null
              }
            ]
          },
          {
            "kind": "ScalarField",
            "alias": null,
            "name": "id",
            "args": null,
            "storageKey": null
          }
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "ImageCarouselTestsQuery",
    "id": "be152cf5dc01cc4ebb523a6f21c625c1",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '727b10351e1078ca0fd5594c5aa6d228';
export default node;
