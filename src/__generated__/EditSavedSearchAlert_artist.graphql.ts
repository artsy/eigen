/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type EditSavedSearchAlert_artist = {
    readonly internalID: string;
    readonly name: string | null;
    readonly " $refType": "EditSavedSearchAlert_artist";
};
export type EditSavedSearchAlert_artist$data = EditSavedSearchAlert_artist;
export type EditSavedSearchAlert_artist$key = {
    readonly " $data"?: EditSavedSearchAlert_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"EditSavedSearchAlert_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "EditSavedSearchAlert_artist",
  "selections": [
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
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '7ad9dfd37f0d396f844bc54c9fb31a9a';
export default node;
