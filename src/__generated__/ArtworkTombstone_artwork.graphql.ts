/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FollowArtistButton_artist$ref } from "./FollowArtistButton_artist.graphql";
declare const _ArtworkTombstone_artwork$ref: unique symbol;
export type ArtworkTombstone_artwork$ref = typeof _ArtworkTombstone_artwork$ref;
export type ArtworkTombstone_artwork = {
    readonly title: string | null;
    readonly medium: string | null;
    readonly date: string | null;
    readonly cultural_maker: string | null;
    readonly artists: ReadonlyArray<{
        readonly name: string | null;
        readonly href: string | null;
        readonly " $fragmentRefs": FollowArtistButton_artist$ref;
    } | null> | null;
    readonly dimensions: {
        readonly in: string | null;
        readonly cm: string | null;
    } | null;
    readonly edition_of: string | null;
    readonly attribution_class: {
        readonly shortDescription: string | null;
    } | null;
    readonly " $refType": ArtworkTombstone_artwork$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtworkTombstone_artwork",
  "type": "Artwork",
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
      "name": "medium",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "date",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "cultural_maker",
      "name": "culturalMaker",
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
        },
        {
          "kind": "FragmentSpread",
          "name": "FollowArtistButton_artist",
          "args": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "dimensions",
      "storageKey": null,
      "args": null,
      "concreteType": "dimensions",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "in",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "cm",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "ScalarField",
      "alias": "edition_of",
      "name": "editionOf",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "attribution_class",
      "name": "attributionClass",
      "storageKey": null,
      "args": null,
      "concreteType": "AttributionClass",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "shortDescription",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '19a31ace2733b8edffc8205a45dbe1ee';
export default node;
