/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { ArtworksGridPaginationContainer_filteredArtworks$ref } from "./ArtworksGridPaginationContainer_filteredArtworks.graphql";
import { Filters_filteredArtworks$ref } from "./Filters_filteredArtworks.graphql";
declare const _FilteredInfiniteScrollGrid_filteredArtworks$ref: unique symbol;
export type FilteredInfiniteScrollGrid_filteredArtworks$ref = typeof _FilteredInfiniteScrollGrid_filteredArtworks$ref;
export type FilteredInfiniteScrollGrid_filteredArtworks = {
    readonly " $fragmentRefs": Filters_filteredArtworks$ref & ArtworksGridPaginationContainer_filteredArtworks$ref;
    readonly " $refType": FilteredInfiniteScrollGrid_filteredArtworks$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FilteredInfiniteScrollGrid_filteredArtworks",
  "type": "FilterArtworks",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "Filters_filteredArtworks",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ArtworksGridPaginationContainer_filteredArtworks",
      "args": null
    }
  ]
};
(node as any).hash = '6caa57c25a2bb48b182f9e3e5dccf183';
export default node;
