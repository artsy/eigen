/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Biography_artist = {
    readonly bio: string | null;
    readonly blurb: string | null;
    readonly " $refType": "Biography_artist";
};
export type Biography_artist$data = Biography_artist;
export type Biography_artist$key = {
    readonly " $data"?: Biography_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"Biography_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Biography_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "bio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "blurb",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = 'c69d884d6a5b77e0d57f6324d613c6be';
export default node;
