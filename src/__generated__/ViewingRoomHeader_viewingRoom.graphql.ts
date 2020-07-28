/* tslint:disable */
/* eslint-disable */

import { ReaderFragment } from "relay-runtime";
import { FragmentRefs } from "relay-runtime";
export type ViewingRoomHeader_viewingRoom = {
    readonly title: string;
    readonly startAt: unknown | null;
    readonly endAt: unknown | null;
    readonly status: string;
    readonly heroImage: {
        readonly imageURLs: {
            readonly normalized: string | null;
        } | null;
    } | null;
    readonly partner: {
        readonly name: string | null;
        readonly href: string | null;
        readonly profile: {
            readonly icon: {
                readonly url: string | null;
            } | null;
        } | null;
    } | null;
    readonly " $refType": "ViewingRoomHeader_viewingRoom";
};
export type ViewingRoomHeader_viewingRoom$data = ViewingRoomHeader_viewingRoom;
export type ViewingRoomHeader_viewingRoom$key = {
    readonly " $data"?: ViewingRoomHeader_viewingRoom$data;
    readonly " $fragmentRefs": FragmentRefs<"ViewingRoomHeader_viewingRoom">;
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "ViewingRoomHeader_viewingRoom",
  "type": "ViewingRoom",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "title",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "startAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "endAt",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "status",
      "args": null,
      "storageKey": null
    },
    {
      "kind": "LinkedField",
      "alias": "heroImage",
      "name": "image",
      "storageKey": null,
      "args": null,
      "concreteType": "ARImage",
      "plural": false,
      "selections": [
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "imageURLs",
          "storageKey": null,
          "args": null,
          "concreteType": "ImageURLs",
          "plural": false,
          "selections": [
            {
              "kind": "ScalarField",
              "alias": null,
              "name": "normalized",
              "args": null,
              "storageKey": null
            }
          ]
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "partner",
      "storageKey": null,
      "args": null,
      "concreteType": "Partner",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "href",
          "args": null,
          "storageKey": null
        },
        {
          "kind": "LinkedField",
          "alias": null,
          "name": "profile",
          "storageKey": null,
          "args": null,
          "concreteType": "Profile",
          "plural": false,
          "selections": [
            {
              "kind": "LinkedField",
              "alias": null,
              "name": "icon",
              "storageKey": null,
              "args": null,
              "concreteType": "Image",
              "plural": false,
              "selections": [
                {
                  "kind": "ScalarField",
                  "alias": null,
                  "name": "url",
                  "args": [
                    {
                      "kind": "Literal",
                      "name": "version",
                      "value": "square"
                    }
                  ],
                  "storageKey": "url(version:\"square\")"
                }
              ]
            }
          ]
        }
      ]
    }
  ]
};
(node as any).hash = '1bd673fdca7fc92603d11a33b71b92e4';
export default node;
