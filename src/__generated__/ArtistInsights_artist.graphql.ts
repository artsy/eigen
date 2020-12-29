/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistInsights_artist = {
    readonly name: string | null;
    readonly internalID: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsightsAuctionResults_artist">;
    readonly " $refType": "ArtistInsights_artist";
};
export type ArtistInsights_artist$data = ArtistInsights_artist;
export type ArtistInsights_artist$key = {
    readonly " $data"?: ArtistInsights_artist$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistInsights_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistInsights_artist",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
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
      "name": "ArtistInsightsAuctionResults_artist"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '77c5d5840bca1cce1b6b7ce8d5a199ad';
export default node;
