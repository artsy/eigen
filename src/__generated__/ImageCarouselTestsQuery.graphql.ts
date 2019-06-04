/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { ImageCarousel_images$ref } from "./ImageCarousel_images.graphql";
export type ImageCarouselTestsQueryVariables = {
    readonly screenWidth: number;
};
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
query ImageCarouselTestsQuery(
  $screenWidth: Int!
) {
  artwork(id: "unused") {
    images {
      ...ImageCarousel_images
    }
    id
  }
}

fragment ImageCarousel_images on Image {
  url
  width
  height
  thumbnail: resized(width: $screenWidth) {
    width
    height
    url
  }
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "screenWidth",
    "type": "Int!",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Literal",
    "name": "id",
    "value": "unused"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "width",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "height",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "ImageCarouselTestsQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v1/*: any*/),
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
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "artwork",
        "storageKey": "artwork(id:\"unused\")",
        "args": (v1/*: any*/),
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
              (v2/*: any*/),
              (v3/*: any*/),
              (v4/*: any*/),
              {
                "kind": "LinkedField",
                "alias": "thumbnail",
                "name": "resized",
                "storageKey": null,
                "args": [
                  {
                    "kind": "Variable",
                    "name": "width",
                    "variableName": "screenWidth"
                  }
                ],
                "concreteType": "ResizedImageUrl",
                "plural": false,
                "selections": [
                  (v3/*: any*/),
                  (v4/*: any*/),
                  (v2/*: any*/)
                ]
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
    "id": "35cce10251babf176c3aa1313217b639",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '3dd459f39afc1a032988f479681dcae9';
export default node;
