/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type Registration_sale = {
    readonly slug: string;
    readonly end_at: string | null;
    readonly is_preview: boolean | null;
    readonly live_start_at: string | null;
    readonly name: string | null;
    readonly start_at: string | null;
    readonly " $refType": "Registration_sale";
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
      "alias": "end_at",
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "is_preview",
      "name": "isPreview",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": "live_start_at",
      "name": "liveStartAt",
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
      "alias": "start_at",
      "name": "startAt",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = 'ee874611434f57e7bd676bc60ed9565b';
export default node;
