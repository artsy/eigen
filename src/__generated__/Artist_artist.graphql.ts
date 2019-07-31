/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { About_artist$ref } from "./About_artist.graphql";
import { Artworks_artist$ref } from "./Artworks_artist.graphql";
import { Header_artist$ref } from "./Header_artist.graphql";
import { Shows_artist$ref } from "./Shows_artist.graphql";
declare const _Artist_artist$ref: unique symbol;
export type Artist_artist$ref = typeof _Artist_artist$ref;
export type Artist_artist = {
    readonly internalID: string;
    readonly slug: string;
    readonly has_metadata: boolean | null;
    readonly counts: {
        readonly artworks: any | null;
        readonly partner_shows: any | null;
        readonly related_artists: number | null;
        readonly articles: number | null;
    } | null;
    readonly " $fragmentRefs": Header_artist$ref & About_artist$ref & Shows_artist$ref & Artworks_artist$ref;
    readonly " $refType": Artist_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Artist_artist",
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
      "name": "Header_artist",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "About_artist",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Shows_artist",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "Artworks_artist",
      "args": null
    }
  ]
};
(node as any).hash = 'f2549700a51ece10bf3a4ebc5336c666';
export default node;
