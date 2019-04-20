/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
declare const _Header_sale$ref: unique symbol;
export type Header_sale$ref = typeof _Header_sale$ref;
export type Header_sale = {
    readonly name: string | null;
    readonly cover_image: ({
        readonly href: string | null;
    }) | null;
    readonly " $refType": Header_sale$ref;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Header_sale",
  "type": "Sale",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "name",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "cover_image",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        }
      ]
    }
  ]
};
(node as any).hash = '5549dfcf5902994061a54baef12fe183';
export default node;
