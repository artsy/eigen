/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FairBooth_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly " $fragmentRefs": FragmentRefs<"FairBoothHeader_show" | "ShowArtworksPreview_show" | "ShowArtistsPreview_show">;
    readonly " $refType": "FairBooth_show";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "FairBooth_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "FragmentSpread",
      "name": "FairBoothHeader_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtworksPreview_show",
      "args": null
    },
    {
      "kind": "FragmentSpread",
      "name": "ShowArtistsPreview_show",
      "args": null
    }
  ]
};
(node as any).hash = '74884b9faeba3e96137a5a96829ee904';
export default node;
