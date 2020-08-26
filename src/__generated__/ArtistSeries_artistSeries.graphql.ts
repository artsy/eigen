/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeries_artistSeries = {
    readonly internalID: string;
    readonly slug: string;
    readonly artistIDs: ReadonlyArray<string>;
    readonly artist: ReadonlyArray<{
        readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMoreSeries_artist">;
    } | null> | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesHeader_artistSeries" | "ArtistSeriesMeta_artistSeries" | "ArtistSeriesArtworks_artistSeries">;
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
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
      "name": "artistIDs",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "artist",
      "name": "artists",
      "storageKey": "artists(size:1)",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1
        }
      ],
      "concreteType": "Artist",
      "plural": true,
      "selections": [
        {
          "kind": "FragmentSpread",
          "name": "ArtistSeriesMoreSeries_artist",
          "args": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistSeriesHeader_artistSeries",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistSeriesMeta_artistSeries",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistSeriesArtworks_artistSeries",
      "args": null
    }
  ]
};
(node as any).hash = 'f7520ea6af7709f9d9c353454d7f7749';
export default node;
