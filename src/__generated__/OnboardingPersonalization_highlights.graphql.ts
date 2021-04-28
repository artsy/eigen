/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalization_highlights = {
    readonly popularArtists: ReadonlyArray<{
        readonly internalID: string;
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
  "argumentDefinitions": [
    {
      "defaultValue": null,
      "kind": "LocalArgument",
      "name": "excludeArtistIDs"
    }
  ],
  "kind": "Fragment",
  "metadata": null,
  "name": "OnboardingPersonalization_highlights",
  "selections": [
    {
      "alias": null,
      "args": [
        {
          "kind": "Variable",
          "name": "excludeArtistIDs",
          "variableName": "excludeArtistIDs"
        },
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
          "name": "internalID",
          "storageKey": null
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistListItem_artist"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Highlights",
  "abstractKey": null
};
(node as any).hash = '46ce767c913d098f2571828c6104b40c';
export default node;
