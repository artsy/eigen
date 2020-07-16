/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeries_artistSeries = {
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesMeta_artistSeries">;
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
      "kind": "FragmentSpread",
      "name": "ArtistSeriesMeta_artistSeries",
      "args": null
    }
  ]
};
(node as any).hash = '2ac26cee63800c5dc6723900d081fe48';
export default node;
