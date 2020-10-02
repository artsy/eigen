/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Header_gene = {
    readonly internalID: string;
    readonly slug: string;
    readonly id: string;
    readonly isFollowed: boolean | null;
    readonly name: string | null;
    readonly " $refType": "Header_gene";
};
export type Header_gene$data = Header_gene;
export type Header_gene$key = {
    readonly " $data"?: Header_gene$data;
    readonly " $fragmentRefs": FragmentRefs<"Header_gene">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Header_gene",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "internalID",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "slug",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "id",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "isFollowed",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    }
  ],
  "type": "Gene",
  "abstractKey": null
};
(node as any).hash = '933d66d54182debd8a9beb9331c5ac35';
export default node;
