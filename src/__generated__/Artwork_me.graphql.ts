/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Artwork_me = {
    readonly " $fragmentRefs": FragmentRefs<"CommercialInformation_me">;
    readonly " $refType": "Artwork_me";
};
export type Artwork_me$data = Artwork_me;
export type Artwork_me$key = {
    readonly " $data"?: Artwork_me$data;
    readonly " $fragmentRefs": FragmentRefs<"Artwork_me">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Artwork_me",
  "type": "Me",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "FragmentSpread",
      "name": "CommercialInformation_me",
      "args": null
    }
  ]
};
(node as any).hash = '3f47e88f99ccf53ed6c4f9a8273b8d54';
export default node;
