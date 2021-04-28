/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalization_highlights = {
    readonly popularArtists: ReadonlyArray<{
        readonly id: string;
        readonly " $fragmentRefs": FragmentRefs<"ArtistListItem_artist">;
    } | null> | null;
    readonly " $refType": "OnboardingPersonalization_highlights";
};
export type OnboardingPersonalization_highlights$data = OnboardingPersonalization_highlights;
export type OnboardingPersonalization_highlights$key = {
    readonly " $data"?: OnboardingPersonalization_highlights$data;
    readonly " $fragmentRefs": FragmentRefs<"OnboardingPersonalization_highlights">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "OnboardingPersonalization_highlights",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "excludeFollowedArtists",
          "value": true
        }
      ],
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "popularArtists",
      "plural": true,
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
      "storageKey": "popularArtists(excludeFollowedArtists:true)"
    }
  ],
  "type": "Highlights",
  "abstractKey": null
};
(node as any).hash = '4c625f24ac965158cf1c50c4d249dd9d';
export default node;
