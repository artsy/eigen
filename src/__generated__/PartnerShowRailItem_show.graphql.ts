/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type PartnerShowRailItem_show = {
    readonly internalID: string;
    readonly slug: string;
    readonly name: string | null;
    readonly exhibitionPeriod: string | null;
    readonly endAt: string | null;
    readonly images: ReadonlyArray<{
        readonly url: string | null;
    } | null> | null;
    readonly " $refType": "PartnerShowRailItem_show";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "PartnerShowRailItem_show",
  "type": "Show",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "internalID",
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
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "exhibitionPeriod",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "images",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": true,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = 'f12d77e2781384f8498d622ce53b9266';
export default node;
