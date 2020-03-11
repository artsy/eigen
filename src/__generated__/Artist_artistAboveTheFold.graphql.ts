/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artist_artistAboveTheFold = {
    readonly internalID: string;
    readonly slug: string;
    readonly has_metadata: boolean | null;
    readonly counts: {
        readonly artworks: number | null;
        readonly partner_shows: number | null;
        readonly related_artists: number | null;
        readonly articles: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtistHeader_artist" | "ArtistArtworks_artist">;
    readonly " $refType": "Artist_artistAboveTheFold";
};
export type Artist_artistAboveTheFold$data = Artist_artistAboveTheFold;
export type Artist_artistAboveTheFold$key = {
    readonly " $data"?: Artist_artistAboveTheFold$data;
    readonly " $fragmentRefs": FragmentRefs<"Artist_artistAboveTheFold">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Artist_artistAboveTheFold",
  "type": "Artist",
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
      "alias": "has_metadata",
      "name": "hasMetadata",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "counts",
      "storageKey": null,
      "args": null,
      "concreteType": "ArtistCounts",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "artworks",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "partner_shows",
          "name": "partnerShows",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": "related_artists",
          "name": "relatedArtists",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "articles",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistHeader_artist",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistArtworks_artist",
      "args": null
    }
  ]
};
(node as any).hash = '17e84f5efbe35b6dacdd1e3ea0980649';
export default node;
