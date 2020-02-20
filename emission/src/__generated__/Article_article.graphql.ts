/* tslint:disable */

import { ReaderFragment } from "relay-runtime";
export type Article_article = {
    readonly thumbnail_title: string | null;
    readonly href: string | null;
    readonly author: {
        readonly name: string | null;
    } | null;
    readonly thumbnail_image: {
        readonly url: string | null;
    } | null;
    readonly " $refType": "Article_article";
};



const node: ReaderFragment = {
  "kind": "Fragment",
  "name": "Article_article",
  "type": "Article",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": "thumbnail_title",
      "name": "thumbnailTitle",
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
      "name": "author",
      "storageKey": null,
      "args": null,
      "concreteType": "Author",
      "plural": false,
      "selections": [
        {
          "kind": "ScalarField",
          "alias": null,
          "name": "name",
          "args": null,
          "storageKey": null
        }
      ]
    },
    {
      "kind": "LinkedField",
      "alias": "thumbnail_image",
      "name": "thumbnailImage",
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
              "value": "large"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    }
  ]
};
(node as any).hash = '8f81ba8bc61dfd95e6f0931566199b1e';
export default node;
