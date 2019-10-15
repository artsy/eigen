/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtistForSaleArtworksGrid_artist$ref } from "./ArtistForSaleArtworksGrid_artist.graphql";
import { ArtistNotForSaleArtworksGrid_artist$ref } from "./ArtistNotForSaleArtworksGrid_artist.graphql";
declare const _Artworks_artist$ref: unique symbol;
export type Artworks_artist$ref = typeof _Artworks_artist$ref;
export type Artworks_artist = {
    readonly counts: {
        readonly artworks: number | null;
        readonly for_sale_artworks: number | null;
    } | null;
    readonly " $fragmentRefs": ArtistForSaleArtworksGrid_artist$ref & ArtistNotForSaleArtworksGrid_artist$ref;
    readonly " $refType": Artworks_artist$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Artworks_artist",
  "type": "Artist",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
          "alias": "for_sale_artworks",
          "name": "forSaleArtworks",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistForSaleArtworksGrid_artist",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtistNotForSaleArtworksGrid_artist",
      "args": null
    }
  ]
};
(node as any).hash = '514384b94d84db0ae79f6560249e55f3';
export default node;
