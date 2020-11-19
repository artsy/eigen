/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkDetail_sharedProps = {
    readonly artist: {
        readonly internalID: string;
    } | null;
    readonly artistNames: string | null;
    readonly category: string | null;
    readonly costMinor: number | null;
    readonly costCurrencyCode: string | null;
    readonly date: string | null;
    readonly depth: string | null;
    readonly editionSize: string | null;
    readonly editionNumber: string | null;
    readonly height: string | null;
    readonly id: string;
    readonly images: ReadonlyArray<{
        readonly isDefault: boolean | null;
        readonly url: string | null;
        readonly width: number | null;
        readonly height: number | null;
    } | null> | null;
    readonly internalID: string;
    readonly medium: string | null;
    readonly metric: string | null;
    readonly slug: string;
    readonly title: string | null;
    readonly width: string | null;
    readonly " $refType": "MyCollectionArtworkDetail_sharedProps";
};
export type MyCollectionArtworkDetail_sharedProps$data = MyCollectionArtworkDetail_sharedProps;
export type MyCollectionArtworkDetail_sharedProps$key = {
    readonly " $data"?: MyCollectionArtworkDetail_sharedProps$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkDetail_sharedProps">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "internalID",
  "storageKey": null
},
v1 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "height",
  "storageKey": null
},
v2 = {
  "alias": null,
  "args": null,
  "kind": "ScalarField",
  "name": "width",
  "storageKey": null
};
return {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkDetail_sharedProps",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artist",
      "plural": false,
      "selections": [
        (v0/*: any*/)
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
    (v1/*: any*/),
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
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
          "name": "url",
          "storageKey": null
        },
        (v2/*: any*/),
        (v1/*: any*/)
      ],
      "storageKey": null
    },
    (v0/*: any*/),
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
    (v2/*: any*/)
  ],
  "type": "Artwork",
  "abstractKey": null
};
})();
(node as any).hash = '3f62774d8a11c09e5e8ee82544c539f2';
export default node;
