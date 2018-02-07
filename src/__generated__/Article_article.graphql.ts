/* tslint:disable */

import { ConcreteFragment } from "relay-runtime";
export type Article_article = {
    readonly thumbnail_title: string | null;
    readonly href: string | null;
    readonly author: ({
        readonly name: string | null;
    }) | null;
    readonly thumbnail_image: ({
        readonly url: string | null;
    }) | null;
};



const node: ConcreteFragment = (function(){
var v0 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__id",
  "args": null,
  "storageKey": null
};
return {
  "kind": "Fragment",
  "name": "Article_article",
  "type": "Article",
  "metadata": null,
  "argumentDefinitions": [],
  "selections": [
    {
      "kind": "ScalarField",
      "alias": null,
      "name": "thumbnail_title",
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
        },
        v0
      ],
      "idField": "__id"
    },
    {
      "kind": "LinkedField",
      "alias": null,
      "name": "thumbnail_image",
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
              "value": "large",
              "type": "[String]"
            }
          ],
          "storageKey": "url(version:\"large\")"
        }
      ]
    },
    v0
  ],
  "idField": "__id"
};
})();
(node as any).hash = '0c88898acb243d600094f137ff15cde0';
export default node;
