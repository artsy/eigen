/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalization_popularArtists = ReadonlyArray<{
    readonly id: string;
    readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    readonly " $refType": "OnboardingPersonalization_popularArtists";
}>;
export type OnboardingPersonalization_popularArtists$data = OnboardingPersonalization_popularArtists;
export type OnboardingPersonalization_popularArtists$key = ReadonlyArray<{
    readonly " $data"?: OnboardingPersonalization_popularArtists$data;
    readonly " $fragmentRefs": FragmentRefs<"OnboardingPersonalization_popularArtists">;
}>;



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": {
    "plural": true
  },
  "name": "OnboardingPersonalization_popularArtists",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistListItem_artist"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = 'fc35c77a5518e4dba09fd1cc60067202';
export default node;
