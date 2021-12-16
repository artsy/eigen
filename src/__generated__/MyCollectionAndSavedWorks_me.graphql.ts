/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorks_me = {
    readonly name: string | null;
    readonly bio: string | null;
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly createdAt: string | null;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileEditFormModal_me">;
    readonly " $refType": "MyCollectionAndSavedWorks_me";
};
export type MyCollectionAndSavedWorks_me$data = MyCollectionAndSavedWorks_me;
export type MyCollectionAndSavedWorks_me$key = {
    readonly " $data"?: MyCollectionAndSavedWorks_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyCollectionAndSavedWorks_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyCollectionAndSavedWorks_me",
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
      "name": "bio",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "concreteType": "Image",
      "kind": "LinkedField",
      "name": "icon",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": [
            {
              "kind": "Literal",
              "name": "version",
              "value": "thumbnail"
            }
          ],
          "kind": "ScalarField",
          "name": "url",
          "storageKey": "url(version:\"thumbnail\")"
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "createdAt",
      "storageKey": null
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyProfileEditFormModal_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = 'd53caa423bcd68a0251cfe7a1e29b9d3';
export default node;
