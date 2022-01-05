/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type AboutWork_artwork = {
    readonly additionalInformation: string | null;
    readonly description: string | null;
    readonly isInAuction: boolean | null;
    readonly " $refType": "AboutWork_artwork";
};
export type AboutWork_artwork$data = AboutWork_artwork;
export type AboutWork_artwork$key = {
    readonly " $data"?: AboutWork_artwork$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"AboutWork_artwork">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "AboutWork_artwork",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "additionalInformation",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isInAuction",
      "storageKey": null
    }
  ],
  "type": "Artwork",
  "abstractKey": null
};
(node as any).hash = 'a8830f77651f940bbb3923922b01150d';
export default node;
