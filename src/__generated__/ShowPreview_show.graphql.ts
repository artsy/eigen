/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ShowPreview_show = {
    readonly slug: string;
    readonly internalID: string;
    readonly name: string | null;
    readonly coverImage: {
        readonly url: string | null;
        readonly aspectRatio: number;
    } | null;
    readonly fair: {
        readonly name: string | null;
    } | null;
    readonly partner: {
        readonly name?: string | null;
    } | null;
    readonly " $refType": "ShowPreview_show";
};
export type ShowPreview_show$data = ShowPreview_show;
export type ShowPreview_show$key = {
    readonly " $data"?: ShowPreview_show$data;
    readonly " $fragmentRefs": FragmentRefs<"ShowPreview_show">;
};



const node: ReaderFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v1 = [
  (v0/*: any*/)
];
return {
  "kind": "Fragment",
  "name": "ShowPreview_show",
  "type": "Show",
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
      "name": "internalID",
      "args": null,
      "storageKey": null
    },
    (v0/*: any*/),
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "coverImage",
      "storageKey": null,
      "args": null,
      "concreteType": "Image",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "url",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "aspectRatio",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "fair",
      "storageKey": null,
      "args": null,
      "concreteType": "Fair",
      "plural": false,
      "selections": (v1/*: any*/)
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": null,
      "plural": false,
      "selections": [
        {
          "kind": "InlineFragment",
          "type": "Partner",
          "selections": (v1/*: any*/)
        }
      ]
    }
  ]
};
})();
(node as any).hash = 'b8c3aa45af3227481a18aaee107f669c';
export default node;
