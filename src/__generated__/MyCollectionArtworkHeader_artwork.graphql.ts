/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkHeader_artwork = {
    readonly artistNames: string | null;
    readonly date: string | null;
    readonly images: ReadonlyArray<{
        readonly isDefault: boolean | null;
        readonly imageURL: string | null;
        readonly internalID: string | null;
        readonly " $fragmentRefs": FragmentRefs<"ImageCarousel_images">;
    } | null> | null;
    readonly internalID: string;
    readonly title: string | null;
    readonly " $refType": "MyCollectionArtworkHeader_artwork";
};
export type MyCollectionArtworkHeader_artwork$data = MyCollectionArtworkHeader_artwork;
export type MyCollectionArtworkHeader_artwork$key = {
    readonly " $data"?: MyCollectionArtworkHeader_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkHeader_artwork">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkHeader_artwork",
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
        (v0/*: any*/),
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ImageCarousel_images"
        }
      ],
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "title",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = '25e10e89a9f9a019f23d47716414dac8';
export default node;
