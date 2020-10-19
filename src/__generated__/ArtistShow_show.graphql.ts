/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistShow_show = {
    readonly slug: string;
    readonly href: string | null;
    readonly is_fair_booth: boolean | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"Metadata_show">;
    readonly " $refType": "ArtistShow_show";
};
export type ArtistShow_show$data = ArtistShow_show;
export type ArtistShow_show$key = {
    readonly " $data"?: ArtistShow_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistShow_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistShow_show",
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
      "name": "href",
      "storageKey": null
    },
    {
      "alias": "is_fair_booth",
      "args": null,
      "kind": "ScalarField",
      "name": "isFairBooth",
      "storageKey": null
    },
    {
      "alias": "cover_image",
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "coverImage",
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
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "Metadata_show"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '2a49838cef4b2200cd2db113bc018c68';
export default node;
