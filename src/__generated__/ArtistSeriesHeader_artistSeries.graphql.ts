/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ArtistSeriesHeader_artistSeries = {
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "ArtistSeriesHeader_artistSeries";
};
export type ArtistSeriesHeader_artistSeries$data = ArtistSeriesHeader_artistSeries;
export type ArtistSeriesHeader_artistSeries$key = {
    readonly " $data"?: ArtistSeriesHeader_artistSeries$data;
    readonly " $fragmentRefs": FragmentRefs<"ArtistSeriesHeader_artistSeries">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "ArtistSeriesHeader_artistSeries",
  "selections": [
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "url",
          "storageKey": null
        }
      ],
      "storageKey": null
    }
  ],
  "type": "ArtistSeries",
  "abstractKey": null
};
(node as any).hash = 'ae504c6f5001719cf6611e595d431138';
export default node;
