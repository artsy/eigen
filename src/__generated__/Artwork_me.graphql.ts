/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Artwork_me",
  "selections": [
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "CommercialInformation_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '3f47e88f99ccf53ed6c4f9a8273b8d54';
export default node;
