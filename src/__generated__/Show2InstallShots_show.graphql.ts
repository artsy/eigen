/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type Show2InstallShots_show = {
    readonly name: string | null;
    readonly images: ReadonlyArray<{
        readonly internalID: string | null;
        readonly caption: string | null;
        readonly src: string | null;
        readonly dimensions: {
            readonly width: number | null;
            readonly height: number | null;
        } | null;
    } | null> | null;
    readonly " $refType": "Show2InstallShots_show";
};
export type Show2InstallShots_show$data = Show2InstallShots_show;
export type Show2InstallShots_show$key = {
    readonly " $data"?: Show2InstallShots_show$data;
    readonly " $fragmentRefs": FragmentRefs<"Show2InstallShots_show">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "Show2InstallShots_show",
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
      "args": [
        {
          "kind": "Literal",
          "name": "default",
          "value": false
        }
      ],
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "images",
      "plural": true,
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
          "name": "caption",
          "storageKey": null
        },
        {
          "alias": "src",
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": [
                "larger",
                "large"
              ]
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:[\"larger\",\"large\"])"
        },
        {
          "alias": "dimensions",
          "args": [
            {
              "kind": "Literal",
              "name": "height",
              "value": 300
            }
          ],
          "concreteType": "ResizedImageUrl",
          "kind": "LinkedField",
          "name": "resized",
          "plural": false,
          "selections": [
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "width",
              "storageKey": null
            },
            {
              "alias": null,
              "args": null,
              "kind": "ScalarField",
              "name": "height",
              "storageKey": null
            }
          ],
          "storageKey": "resized(height:300)"
        }
      ],
      "storageKey": "images(default:false)"
    }
  ],
  "type": "Show",
  "abstractKey": null
};
(node as any).hash = '92b65650a80fc5175f38349cfcfe7024';
export default node;
