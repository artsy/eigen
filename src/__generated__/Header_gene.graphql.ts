/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type Header_gene = {
    readonly internalID: string;
    readonly slug: string;
    readonly id: string;
    readonly isFollowed: boolean | null;
    readonly name: string | null;
    readonly " $refType": "Header_gene";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Header_gene",
  "type": "Gene",
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
      "name": "id",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "isFollowed",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    }
  ]
};
(node as any).hash = '933d66d54182debd8a9beb9331c5ac35';
export default node;
