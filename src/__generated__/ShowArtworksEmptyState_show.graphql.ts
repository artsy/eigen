/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowArtworksEmptyState_show = {
    readonly isFairBooth: boolean | null;
    readonly status: string | null;
    readonly " $refType": "ShowArtworksEmptyState_show";
};
export type ShowArtworksEmptyState_show$data = ShowArtworksEmptyState_show;
export type ShowArtworksEmptyState_show$key = {
    readonly " $data"?: ShowArtworksEmptyState_show$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ShowArtworksEmptyState_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ShowArtworksEmptyState_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFairBooth",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "status",
      "storageKey": null
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'be321818d2ec1658c3e5dfa05febe366';
export default node;
