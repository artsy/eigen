/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type FeatureHeader_feature = {
    readonly name: string;
    readonly subheadline: string | null;
    readonly image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "FeatureHeader_feature";
};
export type FeatureHeader_feature$data = FeatureHeader_feature;
export type FeatureHeader_feature$key = {
    readonly " $data"?: FeatureHeader_feature$data;
    readonly " $fragmentRefs": FragmentRefs<"FeatureHeader_feature">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "FeatureHeader_feature",
  "selections": [
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "name",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "subheadline",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "image",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "source"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"source\")"
        }
      ],
      "storageKey": null
    }
  ],
  "type": "Feature",
  "abstractKey": null
};
(node as any).hash = '954e997b8f74ab448312d969a47d54d6';
export default node;
