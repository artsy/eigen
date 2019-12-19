/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Collection_collection = {
    readonly " $fragmentRefs": FragmentRefs<"CollectionHeader_collection" | "CollectionArtworkPreview_collection" | "CollectionArtworks_collection">;
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
      "name": "CollectionArtworkPreview_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "CollectionArtworks_collection",
      "args": null
    }
  ]
};
(node as any).hash = 'f9c1b89d0d61c1cf913491a66ab20518';
export default node;
