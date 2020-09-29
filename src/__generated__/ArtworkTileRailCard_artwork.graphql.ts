/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "ArtworkTileRailCard_artwork",
  "type": "Artwork",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "artistNames",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "imageURL",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "saleMessage",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'de14e62741b78049e125db859e256e6c';
export default node;
