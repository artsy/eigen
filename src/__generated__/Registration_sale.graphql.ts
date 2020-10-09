/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

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
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Registration_sale",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": "end_at",
      "args": null,
      "kind": "ScalarField",
      "name": "endAt",
      "storageKey": null
    },
    {
      "alias": "is_preview",
      "args": null,
      "kind": "ScalarField",
      "name": "isPreview",
      "storageKey": null
    },
    {
      "alias": "live_start_at",
      "args": null,
      "kind": "ScalarField",
      "name": "liveStartAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": "start_at",
      "args": null,
      "kind": "ScalarField",
      "name": "startAt",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "requireIdentityVerification",
      "storageKey": null
    }
  ],
  "type": "Sale",
  "abstractKey": null
};
(node as any).hash = '87d8938cb35a159630b79a4a96417b16';
export default node;
