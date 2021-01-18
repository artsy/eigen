/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairAllFollowedArtists_fair = {
    readonly internalID: string;
    readonly slug: string;
    readonly " $fragmentRefs": FragmentRefs<"FairArtworks_fair">;
    readonly " $refType": "FairAllFollowedArtists_fair";
};
export type FairAllFollowedArtists_fair$data = FairAllFollowedArtists_fair;
export type FairAllFollowedArtists_fair$key = {
    readonly " $data"?: FairAllFollowedArtists_fair$data;
    readonly " $fragmentRefs": FragmentRefs<"FairAllFollowedArtists_fair">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FairAllFollowedArtists_fair",
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
    },
    {
      "args": [
        {
          "kind": "Literal",
          "name": "includeArtworksByFollowedArtists",
          "value": true
        }
      ],
      "kind": "FragmentSpread",
      "name": "FairArtworks_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '6f43d2010c52c6fcb960769e30119d4e';
export default node;
