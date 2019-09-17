/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FairBoothHeader_show$ref } from "./FairBoothHeader_show.graphql";
import { ShowArtistsPreview_show$ref } from "./ShowArtistsPreview_show.graphql";
import { ShowArtworksPreview_show$ref } from "./ShowArtworksPreview_show.graphql";
declare const _FairBooth_show$ref: unique symbol;
export type FairBooth_show$ref = typeof _FairBooth_show$ref;
export type FairBooth_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly " $fragmentRefs": FairBoothHeader_show$ref & ShowArtworksPreview_show$ref & ShowArtistsPreview_show$ref;
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
    }
  ]
};
(node as any).hash = '74884b9faeba3e96137a5a96829ee904';
export default node;
