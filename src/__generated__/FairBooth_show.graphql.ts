/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairBooth_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly " $fragmentRefs": FragmentRefs<"FairBoothHeader_show" | "ShowArtworksPreview_show" | "ShowArtistsPreview_show">;
    readonly " $refType": "FairBooth_show";
};
export type FairBooth_show$data = FairBooth_show;
export type FairBooth_show$key = {
    readonly " $data"?: FairBooth_show$data;
    readonly " $fragmentRefs": FragmentRefs<"FairBooth_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairBooth_show",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "FairBoothHeader_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowArtworksPreview_show"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ShowArtistsPreview_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '74884b9faeba3e96137a5a96829ee904';
export default node;
