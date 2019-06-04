/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _ImageCarousel_images$ref: unique symbol;
export type ImageCarousel_images$ref = typeof _ImageCarousel_images$ref;
export type ImageCarousel_images = ReadonlyArray<{
    readonly url: string | null;
    readonly width: number | null;
    readonly height: number | null;
    readonly thumbnail: {
        readonly width: number | null;
        readonly height: number | null;
        readonly url: string | null;
    } | null;
    readonly " $refType": ImageCarousel_images$ref;
}>;



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "url",
  "args": null,
  "storageKey": null
},
v1 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "width",
  "args": null,
  "storageKey": null
},
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "height",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "ImageCarousel_images",
  "type": "Image",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [
    {
      "kind": "RootArgument",
      "name": "screenWidth",
      "type": "Int"
    }
  ],
  "selections": [
    (v0/*: any*/),
    (v1/*: any*/),
    (v2/*: any*/),
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
        (v1/*: any*/),
        (v2/*: any*/),
        (v0/*: any*/)
      ]
    }
  ]
};
})();
(node as any).hash = '2922bb8d9aff3ad1be12017355d9ec37';
export default node;
