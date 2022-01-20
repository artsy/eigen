/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyCollectionAndSavedWorks_me = {
    readonly name: string | null;
    readonly bio: string | null;
    readonly location: {
        readonly city: string | null;
    } | null;
    readonly otherRelevantPosition: string | null;
    readonly profession: string | null;
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
      "concreteType": "MyLocation",
      "kind": "LinkedField",
      "name": "location",
      "plural": false,
      "selections": [
        {
          "alias": null,
          "args": null,
          "kind": "ScalarField",
          "name": "city",
          "storageKey": null
        }
      ],
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "otherRelevantPosition",
      "storageKey": null
    },
    {
      "alias": null,
      "args": null,
      "kind": "ScalarField",
      "name": "profession",
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
(node as any).hash = '069a8fb0ef25ff69d145bab4adcd9782';
export default node;
