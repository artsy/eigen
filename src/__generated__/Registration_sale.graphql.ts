/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Registration_sale$ref: unique symbol;
export type Registration_sale$ref = typeof _Registration_sale$ref;
export type Registration_sale = {
    readonly slug: string;
    readonly end_at: string | null;
    readonly is_preview: boolean | null;
    readonly live_start_at: string | null;
    readonly name: string | null;
    readonly start_at: string | null;
    readonly " $refType": Registration_sale$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Registration_sale",
  "type": "Sale",
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
      "name": "end_at",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "is_preview",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "live_start_at",
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
      "name": "start_at",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '09f732c342c6b61f33997cffc139e617';
export default node;
