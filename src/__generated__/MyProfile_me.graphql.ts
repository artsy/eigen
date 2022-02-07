/* tslint:disable */
/* eslint-disable */
// @ts-nocheck

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type MyProfile_me = {
    readonly name: string | null;
    readonly bio: string | null;
    readonly icon: {
        readonly url: string | null;
    } | null;
    readonly " $fragmentRefs": FragmentRefs<"MyProfileHeaderMyCollectionAndSavedWorks_me" | "MyProfileEditForm_me">;
    readonly " $refType": "MyProfile_me";
};
export type MyProfile_me$data = MyProfile_me;
export type MyProfile_me$key = {
    readonly " $data"?: MyProfile_me$data | undefined;
    readonly " $fragmentRefs": FragmentRefs<"MyProfile_me">;
};



const node: ReaderFragment = {
  "argumentDefinitions": [],
  "kind": "Fragment",
  "metadata": null,
  "name": "MyProfile_me",
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
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyProfileHeaderMyCollectionAndSavedWorks_me"
    },
    {
      "args": null,
      "kind": "FragmentSpread",
      "name": "MyProfileEditForm_me"
    }
  ],
  "type": "Me",
  "abstractKey": null
};
(node as any).hash = '3063d644f89b6aeeacbca12088e0a939';
export default node;
