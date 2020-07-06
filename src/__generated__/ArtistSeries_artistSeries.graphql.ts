/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeries_artistSeries = {
    readonly title: string;
    readonly description: string | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
        readonly href: string | null;
    } | null> | null;
    readonly " $refType": "ArtistSeries_artistSeries";
};
export type ArtistSeries_artistSeries$data = ArtistSeries_artistSeries;
export type ArtistSeries_artistSeries$key = {
    readonly " $data"?: ArtistSeries_artistSeries$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeries_artistSeries">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistSeries_artistSeries",
  "type": "ArtistSeries",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "description",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "artists",
      "storageKey": null,
      "args": null,
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'f2b697477dd1f76a706c46111a995c8f';
export default node;
