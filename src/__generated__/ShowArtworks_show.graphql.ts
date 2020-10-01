/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtworks_show = {
    readonly id: string;
    readonly slug: string;
    readonly internalID: string;
    readonly " $fragmentRefs": FragmentRefs<"FilteredInfiniteScrollGrid_entity">;
    readonly " $refType": "ShowArtworks_show";
};
export type ShowArtworks_show$data = ShowArtworks_show;
export type ShowArtworks_show$key = {
    readonly " $data"?: ShowArtworks_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowArtworks_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowArtworks_show",
  "selections": [
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
      "name": "FilteredInfiniteScrollGrid_entity"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'd18ae5be25656a4cea38614cf43825e9';
export default node;
