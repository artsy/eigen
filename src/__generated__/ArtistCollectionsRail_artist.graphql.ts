/* tslint:disable */
/* eslint-disable */

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
  "kind": "Fragment",
  "name": "ArtistCollectionsRail_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '4989d2fb9937bf57e6d26b9532e047c9';
export default node;
