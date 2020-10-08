/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeaturedCollectionsRail_collection = {
    readonly slug: string;
    readonly id: string;
    readonly " $refType": "FeaturedCollectionsRail_collection";
};
export type FeaturedCollectionsRail_collection$data = FeaturedCollectionsRail_collection;
export type FeaturedCollectionsRail_collection$key = {
    readonly " $data"?: FeaturedCollectionsRail_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"FeaturedCollectionsRail_collection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeaturedCollectionsRail_collection",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    }
  ],
  "type": "MarketingCollection",
  "abstractKey": null
};
(node as any).hash = 'b3b81460378ae369b7fc090f6e961471';
export default node;
