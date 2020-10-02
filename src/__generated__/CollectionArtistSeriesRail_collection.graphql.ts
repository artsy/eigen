/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type CollectionArtistSeriesRail_collection = {
    readonly slug: string;
    readonly id: string;
    readonly " $refType": "CollectionArtistSeriesRail_collection";
};
export type CollectionArtistSeriesRail_collection$data = CollectionArtistSeriesRail_collection;
export type CollectionArtistSeriesRail_collection$key = {
    readonly " $data"?: CollectionArtistSeriesRail_collection$data;
    readonly " $fragmentRefs": FragmentRefs<"CollectionArtistSeriesRail_collection">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "CollectionArtistSeriesRail_collection",
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
(node as any).hash = '4fc25d762cedf770e4ec928ee522ea86';
export default node;
