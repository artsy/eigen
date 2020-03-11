/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "ShowArtworks_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "id",
      "args": null,
      "storageKey": null
    },
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
      "name": "FilteredInfiniteScrollGrid_entity",
      "args": null
    }
  ]
};
(node as any).hash = 'd18ae5be25656a4cea38614cf43825e9';
export default node;
