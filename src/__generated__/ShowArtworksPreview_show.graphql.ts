/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { GenericGrid_artworks$ref } from "./GenericGrid_artworks.graphql";
declare const _ShowArtworksPreview_show$ref: unique symbol;
export type ShowArtworksPreview_show$ref = typeof _ShowArtworksPreview_show$ref;
export type ShowArtworksPreview_show = {
    readonly __id: string;
    readonly artworks: ReadonlyArray<({
        readonly " $fragmentRefs": GenericGrid_artworks$ref;
    }) | null> | null;
    readonly counts: ({
        readonly artworks: number | null;
    }) | null;
    readonly " $refType": ShowArtworksPreview_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ShowArtworksPreview_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "__id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artworks",
      "storageKey": "artworks(size:6)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 6,
          "type": "Int"
        }
      ],
      "concreteType": "Artwork",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "GenericGrid_artworks",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ShowCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'e9a2bd9594b37bdc9a58324fddaac1e0';
export default node;
