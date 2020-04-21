/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesRail_collections = ReadonlyArray<{
    readonly headerImage: string | null;
    readonly slug: string;
    readonly title: string;
    readonly price_guidance: number | null;
    readonly " $refType": "ArtistSeriesRail_collections";
}>;
export type ArtistSeriesRail_collections$data = ArtistSeriesRail_collections;
export type ArtistSeriesRail_collections$key = ReadonlyArray<{
    readonly " $data"?: ArtistSeriesRail_collections$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesRail_collections">;
}>;



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistSeriesRail_collections",
  "type": "MarketingCollection",
  "metadata": {
    "plural": true
  },
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "headerImage",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "slug",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "price_guidance",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '68f46a39dea807c695ed19eca86e89fa';
export default node;
