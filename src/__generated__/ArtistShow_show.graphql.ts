/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { Metadata_show$ref } from "./Metadata_show.graphql";
declare const _ArtistShow_show$ref: unique symbol;
export type ArtistShow_show$ref = typeof _ArtistShow_show$ref;
export type ArtistShow_show = {
    readonly slug: string;
    readonly href: string | null;
    readonly is_fair_booth: boolean | null;
    readonly cover_image: {
        readonly url: string | null;
    } | null;
    readonly " $fragmentRefs": Metadata_show$ref;
    readonly " $refType": ArtistShow_show$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistShow_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "href",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_fair_booth",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cover_image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "Metadata_show",
      "args": null
    }
  ]
};
(node as any).hash = '376118a70fac0f1543df56b788ffc408';
export default node;
