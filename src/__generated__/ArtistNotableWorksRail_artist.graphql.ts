/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistNotableWorksRail_artist = {
    readonly internalID: string;
    readonly slug: string;
    readonly filterArtworksConnection: {
        readonly edges: ReadonlyArray<{
            readonly node: {
                readonly " $fragmentRefs": FragmentRefs<"SmallArtworkRail_artworks">;
            } | null;
        } | null> | null;
    } | null;
    readonly " $refType": "ArtistNotableWorksRail_artist";
};
export type ArtistNotableWorksRail_artist$data = ArtistNotableWorksRail_artist;
export type ArtistNotableWorksRail_artist$key = {
    readonly " $data"?: ArtistNotableWorksRail_artist$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"ArtistNotableWorksRail_artist">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistNotableWorksRail_artist",
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
      "args": [
        {
          "kind": "Literal",
          "name": "first",
          "value": 10
        },
        {
          "kind": "Literal",
          "name": "input",
          "value": {
            "sort": "-weighted_iconicity"
          }
        }
      ],
      "concreteType": "FilterArtworksConnection",
      "kind": "LinkedField",
      "name": "filterArtworksConnection",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "concreteType": "FilterArtworksEdge",
          "kind": "LinkedField",
          "name": "edges",
          "plural": true,
          "selections": [
            {
              "alias": null,
              "args": null,
              "concreteType": "Artwork",
              "kind": "LinkedField",
              "name": "node",
              "plural": false,
              "selections": [
                {
                  "args": null,
                  "kind": "FragmentSpread",
                  "name": "SmallArtworkRail_artworks"
                }
              ],
              "storageKey": null
            }
          ],
          "storageKey": null
        }
      ],
      "storageKey": "filterArtworksConnection(first:10,input:{\"sort\":\"-weighted_iconicity\"})"
    }
  ],
  "type": "Artist",
  "abstractKey": null
};
(node as any).hash = '043d0056d691b9a4809647339db9e4f7';
export default node;
