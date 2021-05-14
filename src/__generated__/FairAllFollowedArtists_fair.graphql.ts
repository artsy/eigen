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
          "name": "input",
          "value": {
            "includeArtworksByFollowedArtists": true
          }
        }
      ],
      "kind": "FragmentSpread",
      "name": "FairArtworks_fair"
    }
  ],
  "type": "Fair",
  "abstractKey": null
};
(node as any).hash = '686f5afb388e6a071e4326e10bf3d4c9';
export default node;
