/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeries_artistSeries = {
    readonly title: string;
    readonly " $refType": "ArtistSeries_artistSeries";
};
export type ArtistSeries_artistSeries$data = ArtistSeries_artistSeries;
export type ArtistSeries_artistSeries$key = {
    readonly " $data"?: ArtistSeries_artistSeries$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeries_artistSeries">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ArtistSeries_artistSeries",
  "type": "ArtistSeries",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'dcfc7f437925ca7cc7b7af093bffb495';
export default node;
