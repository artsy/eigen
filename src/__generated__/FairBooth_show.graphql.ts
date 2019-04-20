/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FairBoothHeader_show$ref } from "./FairBoothHeader_show.graphql";
import { ShowArtistsPreview_show$ref } from "./ShowArtistsPreview_show.graphql";
import { ShowArtists_show$ref } from "./ShowArtists_show.graphql";
import { ShowArtworksPreview_show$ref } from "./ShowArtworksPreview_show.graphql";
import { ShowArtworks_show$ref } from "./ShowArtworks_show.graphql";
declare const _FairBooth_show$ref: unique symbol;
export type FairBooth_show$ref = typeof _FairBooth_show$ref;
export type FairBooth_show = {
    readonly gravityID: string;
    readonly _id: string;
    readonly " $fragmentRefs": FairBoothHeader_show$ref & ShowArtworksPreview_show$ref & ShowArtistsPreview_show$ref & ShowArtists_show$ref & ShowArtworks_show$ref;
    readonly " $refType": FairBooth_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairBooth_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "gravityID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "_id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairBoothHeader_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworksPreview_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtistsPreview_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtists_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworks_show",
      "args": null
    }
  ]
};
(node as any).hash = 'd2ca0f593516cc2e05ad35e9569b448b';
export default node;
