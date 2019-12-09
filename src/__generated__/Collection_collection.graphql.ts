/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Collection_collection = {
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_collection" | "CollectionArtworks_collection" | "FeaturedArtists_featuredArtists">;
    readonly " $refType": "Collection_collection";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Collection_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CollectionHeader_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CollectionArtworks_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeaturedArtists_featuredArtists",
      "args": null
    }
  ]
};
(node as any).hash = '648faa62b42cab83520e98399994c70d';
export default node;
