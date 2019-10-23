/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artworks_artist = {
    readonly counts: {
        readonly artworks: number | null;
        readonly for_sale_artworks: number | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"ArtistForSaleArtworksGrid_artist" | "ArtistNotForSaleArtworksGrid_artist">;
    readonly " $refType": "Artworks_artist";
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
