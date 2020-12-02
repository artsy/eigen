/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2ArtworksEmptyState_show = {
    readonly isFairBooth: boolean | null;
    readonly status: string | null;
    readonly " $refType": "Show2ArtworksEmptyState_show";
};
export type Show2ArtworksEmptyState_show$data = Show2ArtworksEmptyState_show;
export type Show2ArtworksEmptyState_show$key = {
    readonly " $data"?: Show2ArtworksEmptyState_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2ArtworksEmptyState_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2ArtworksEmptyState_show",
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
(node as any).hash = '1d67f8f055857f0df03f343cf787a283';
export default node;
