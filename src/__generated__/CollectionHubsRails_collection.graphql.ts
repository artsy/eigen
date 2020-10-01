/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionHubsRails_collection",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CollectionArtistSeriesRail_collection"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "FeaturedCollectionsRail_collection"
    }
  ],
  "type": "MarketingCollection",
  "abstractKey": null
};
(node as any).hash = 'eda147707434616bc52b369a4c92cd24';
export default node;
