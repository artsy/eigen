/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistHeaderFloatingButtons_artist = {
    readonly internalID: string;
    readonly slug: string;
    readonly href: string | null;
    readonly name: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "ArtistHeaderFloatingButtons_artist";
};
export type ArtistHeaderFloatingButtons_artist$data = ArtistHeaderFloatingButtons_artist;
export type ArtistHeaderFloatingButtons_artist$key = {
    readonly " $data"?: ArtistHeaderFloatingButtons_artist$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtistHeaderFloatingButtons_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistHeaderFloatingButtons_artist",
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
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
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
              "name": "version",
              "value": "large"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"large\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = 'c5d4d4562c2c5041db0740cdcba38790';
export default node;
