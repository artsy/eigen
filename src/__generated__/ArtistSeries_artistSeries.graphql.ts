/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeries_artistSeries = {
    readonly internalID: string;
    readonly slug: string;
    readonly artistIDs: ReadonlyArray<string>;
    readonly artist: ReadonlyArray<{
        readonly artistSeriesConnection: {
            readonly totalCount: number;
        } | null;
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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistSeries_artistSeries",
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
      "name": "artistIDs",
      "storageKey": null
    },
    {
      "alias": "artist",
      "args": [
        {
          "kind": "Literal",
          "name": "size",
          "value": 1
        }
      ],
      "concreteType": "Artist",
      "kind": "LinkedField",
      "name": "artists",
      "plural": true,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "first",
              "value": 4
            }
          ],
          "concreteType": "ArtistSeriesConnection",
          "kind": "LinkedField",
          "name": "artistSeriesConnection",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "totalCount",
              "storageKey": null
            }
          ],
          "storageKey": "artistSeriesConnection(first:4)"
        },
        {
          "args": null,
          "kind": "FragmentSpread",
          "name": "ArtistSeriesMoreSeries_artist"
        }
      ],
      "storageKey": "artists(size:1)"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistSeriesHeader_artistSeries"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "ArtistSeriesMeta_artistSeries"
    },
    {
      "args": [
        {
          "kind": "Literal",
          "name": "input",
          "value": {
            "dimensionRange": "*-*",
            "sort": "-decayed_merch"
          }
        }
      ],
      "kind": "FragmentSpread",
      "name": "ArtistSeriesArtworks_artistSeries"
    }
  ],
  "type": "ArtistSeries",
  "abstractKey": null
};
(node as any).hash = 'd7cdaecd1174f42cc89c096d346c2311';
export default node;
