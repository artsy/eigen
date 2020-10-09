/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistCollectionsRail_artist = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $refType": "ArtistCollectionsRail_artist";
};
export type ArtistCollectionsRail_artist$data = ArtistCollectionsRail_artist;
export type ArtistCollectionsRail_artist$key = {
    readonly " $data"?: ArtistCollectionsRail_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistCollectionsRail_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistCollectionsRail_artist",
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
      "name": "slug",
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '4989d2fb9937bf57e6d26b9532e047c9';
export default node;
