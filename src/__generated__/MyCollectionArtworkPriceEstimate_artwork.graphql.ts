/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionArtworkPriceEstimate_artwork = {
    readonly pricePaid: {
        readonly display: string | null;
    } | null;
    readonly internalID: string;
    readonly sizeBucket: string | null;
    readonly slug: string;
    readonly " $refType": "MyCollectionArtworkPriceEstimate_artwork";
};
export type MyCollectionArtworkPriceEstimate_artwork$data = MyCollectionArtworkPriceEstimate_artwork;
export type MyCollectionArtworkPriceEstimate_artwork$key = {
    readonly " $data"?: MyCollectionArtworkPriceEstimate_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionArtworkPriceEstimate_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionArtworkPriceEstimate_artwork",
  "selections": [
    {
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
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "sizeBucket",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = '098ffa3b63ff9bf2439ba32161ca998a';
export default node;
