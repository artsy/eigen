/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionHubsRails_collection = {
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collection" | "FeaturedCollectionsRail_collection">;
    readonly " $refType": "CollectionHubsRails_collection";
};
export type CollectionHubsRails_collection$data = CollectionHubsRails_collection;
export type CollectionHubsRails_collection$key = {
    readonly " $data"?: CollectionHubsRails_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionHubsRails_collection">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "CollectionHubsRails_collection",
  "type": "MarketingCollection",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CollectionArtistSeriesRail_collection",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FeaturedCollectionsRail_collection",
      "args": null
    }
  ]
};
(node as any).hash = 'eda147707434616bc52b369a4c92cd24';
export default node;
