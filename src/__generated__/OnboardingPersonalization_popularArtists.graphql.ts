/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type OnboardingPersonalization_popularArtists = ReadonlyArray<{
    readonly slug: string;
    readonly internalID: string;
    readonly id: string;
    readonly name: string | null;
    readonly image: {
        readonly cropped: {
            readonly url: string;
        } | null;
    } | null;
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
      "name": "slug",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
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
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 100
            },
            {
              "kind": "Literal",
              "name": "width",
              "value": 100
            }
          ],
          "concreteType": "CroppedImageUrl",
          "kind": "LinkedField",
          "name": "cropped",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "url",
              "storageKey": null
            }
          ],
          "storageKey": "cropped(height:100,width:100)"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '35f581971c7a768226bf3827802a5d8c';
export default node;
