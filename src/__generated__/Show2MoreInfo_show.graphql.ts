/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2MoreInfo_show = {
    readonly href: string | null;
    readonly about: string | null;
    readonly pressRelease: string | null;
    readonly " $refType": "Show2MoreInfo_show";
};
export type Show2MoreInfo_show$data = Show2MoreInfo_show;
export type Show2MoreInfo_show$key = {
    readonly " $data"?: Show2MoreInfo_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2MoreInfo_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2MoreInfo_show",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "href",
      "storageKey": null
    },
    {
      "alias": "about",
      "args": null,
      "kind": "ScalarField",
      "name": "description",
      "storageKey": null
    },
    {
      "alias": null,
      "args": [
        {
          "kind": "Literal",
          "name": "format",
          "value": "MARKDOWN"
        }
      ],
      "kind": "ScalarField",
      "name": "pressRelease",
      "storageKey": "pressRelease(format:\"MARKDOWN\")"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = 'fe8c08f507737e110f2297f6650520f1';
export default node;
