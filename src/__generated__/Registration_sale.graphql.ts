/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Registration_sale = {
    readonly slug: string;
    readonly end_at: string | null;
    readonly is_preview: boolean | null;
    readonly live_start_at: string | null;
    readonly name: string | null;
    readonly start_at: string | null;
    readonly requireIdentityVerification: boolean | null;
    readonly " $refType": "Registration_sale";
};
export type Registration_sale$data = Registration_sale;
export type Registration_sale$key = {
    readonly " $data"?: Registration_sale$data;
    readonly " $fragmentRefs": FragmentRefs<"Registration_sale">;
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
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "requireIdentityVerification",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '87d8938cb35a159630b79a4a96417b16';
export default node;
