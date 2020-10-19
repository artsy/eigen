/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtworkTileRailCard_artwork = {
    readonly slug: string;
    readonly internalID: string;
    readonly href: string | null;
    readonly artistNames: string | null;
    readonly image: {
        readonly imageURL: string | null;
    } | null;
    readonly saleMessage: string | null;
    readonly " $refType": "ArtworkTileRailCard_artwork";
};
export type ArtworkTileRailCard_artwork$data = ArtworkTileRailCard_artwork;
export type ArtworkTileRailCard_artwork$key = {
    readonly " $data"?: ArtworkTileRailCard_artwork$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtworkTileRailCard_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtworkTileRailCard_artwork",
  "selections": [
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
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
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
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "imageURL",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "saleMessage",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'de14e62741b78049e125db859e256e6c';
export default node;
