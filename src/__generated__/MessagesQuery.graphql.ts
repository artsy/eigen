/* tslint:disable */

import { ConcreteRequest } from "relay-runtime";
import { Messages_conversation$ref } from "./Messages_conversation.graphql";
export type MessagesQueryVariables = {
    readonly conversationID: string;
    readonly count: number;
    readonly after?: string | null;
};
export type MessagesQueryResponse = {
    readonly me: ({
        readonly conversation: ({
            readonly " $fragmentRefs": Messages_conversation$ref;
        }) | null;
    }) | null;
};
export type MessagesQuery = {
    readonly response: MessagesQueryResponse;
    readonly variables: MessagesQueryVariables;
};



/*
query MessagesQuery(
  $conversationID: String!
  $count: Int!
  $after: String
) {
  me {
    conversation(id: $conversationID) {
      ...Messages_conversation_2QE1um
      id
    }
    id
  }
}

fragment Messages_conversation_2QE1um on Conversation {
  id
  internalID
  from {
    name
    email
    initials
  }
  to {
    name
    initials
  }
  initial_message
  messages(first: $count, after: $after, sort: DESC) {
    pageInfo {
      startCursor
      endCursor
      hasPreviousPage
      hasNextPage
    }
    edges {
      cursor
      node {
        id
        impulse_id
        is_from_user
        body
        attachments {
          internalID
        }
        ...Message_message
        __typename
      }
    }
  }
  items {
    artwork: item {
      __typename
      ... on Artwork {
        href
        ...ArtworkPreview_artwork
      }
      ... on Node {
        id
      }
    }
    show: item {
      __typename
      ... on Show {
        href
        ...ShowPreview_show
      }
      ... on Node {
        id
      }
    }
  }
}

fragment Message_message on Message {
  body
  created_at
  is_from_user
  from {
    name
    email
  }
  invoice {
    payment_url
    ...InvoicePreview_invoice
    id
  }
  attachments {
    internalID
    content_type
    download_url
    file_name
    ...ImagePreview_attachment
    ...PDFPreview_attachment
  }
}

fragment ArtworkPreview_artwork on Artwork {
  gravityID
  internalID
  title
  artist_names
  date
  image {
    url
  }
}

fragment ShowPreview_show on Show {
  gravityID
  internalID
  name
  cover_image {
    url
  }
  fair {
    name
    id
  }
  partner {
    __typename
    ... on Partner {
      name
    }
    ... on Node {
      id
    }
    ... on ExternalPartner {
      id
    }
  }
}

fragment InvoicePreview_invoice on Invoice {
  payment_url
  state
  total
  lewitt_invoice_id
}

fragment ImagePreview_attachment on Attachment {
  download_url
  ...AttachmentPreview_attachment
}

fragment PDFPreview_attachment on Attachment {
  file_name
  ...AttachmentPreview_attachment
}

fragment AttachmentPreview_attachment on Attachment {
  internalID
}
*/

const node: ConcreteRequest = (function(){
var v0 = [
  {
    "kind": "LocalArgument",
    "name": "conversationID",
    "type": "String!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "count",
    "type": "Int!",
    "defaultValue": null
  },
  {
    "kind": "LocalArgument",
    "name": "after",
    "type": "String",
    "defaultValue": null
  }
],
v1 = [
  {
    "kind": "Variable",
    "name": "id",
    "variableName": "conversationID",
    "type": "String!"
  }
],
v2 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "id",
  "args": null,
  "storageKey": null
},
v3 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "internalID",
  "args": null,
  "storageKey": null
},
v4 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "name",
  "args": null,
  "storageKey": null
},
v5 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "email",
  "args": null,
  "storageKey": null
},
v6 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "initials",
  "args": null,
  "storageKey": null
},
v7 = [
  {
    "kind": "Variable",
    "name": "after",
    "variableName": "after",
    "type": "String"
  },
  {
    "kind": "Variable",
    "name": "first",
    "variableName": "count",
    "type": "Int"
  },
  {
    "kind": "Literal",
    "name": "sort",
    "value": "DESC",
    "type": "sort"
  }
],
v8 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "__typename",
  "args": null,
  "storageKey": null
},
v9 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "href",
  "args": null,
  "storageKey": null
},
v10 = {
  "kind": "ScalarField",
  "alias": null,
  "name": "gravityID",
  "args": null,
  "storageKey": null
},
v11 = [
  {
    "kind": "ScalarField",
    "alias": null,
    "name": "url",
    "args": null,
    "storageKey": null
  }
];
return {
  "kind": "Request",
  "fragment": {
    "kind": "Fragment",
    "name": "MessagesQuery",
    "type": "Query",
    "metadata": null,
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              {
                "kind": "FragmentSpread",
                "name": "Messages_conversation",
                "args": [
                  {
                    "kind": "Variable",
                    "name": "after",
                    "variableName": "after",
                    "type": null
                  },
                  {
                    "kind": "Variable",
                    "name": "count",
                    "variableName": "count",
                    "type": null
                  }
                ]
              }
            ]
          }
        ]
      }
    ]
  },
  "operation": {
    "kind": "Operation",
    "name": "MessagesQuery",
    "argumentDefinitions": (v0/*: any*/),
    "selections": [
      {
        "kind": "LinkedField",
        "alias": null,
        "name": "me",
        "storageKey": null,
        "args": null,
        "concreteType": "Me",
        "plural": false,
        "selections": [
          {
            "kind": "LinkedField",
            "alias": null,
            "name": "conversation",
            "storageKey": null,
            "args": (v1/*: any*/),
            "concreteType": "Conversation",
            "plural": false,
            "selections": [
              (v2/*: any*/),
              (v3/*: any*/),
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "from",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationInitiator",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v5/*: any*/),
                  (v6/*: any*/)
                ]
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "to",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationResponder",
                "plural": false,
                "selections": [
                  (v4/*: any*/),
                  (v6/*: any*/)
                ]
              },
              {
                "kind": "ScalarField",
                "alias": null,
                "name": "initial_message",
                "args": null,
                "storageKey": null
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "messages",
                "storageKey": null,
                "args": (v7/*: any*/),
                "concreteType": "MessageConnection",
                "plural": false,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "pageInfo",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "PageInfo",
                    "plural": false,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "startCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "endCursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasPreviousPage",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "hasNextPage",
                        "args": null,
                        "storageKey": null
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": null,
                    "name": "edges",
                    "storageKey": null,
                    "args": null,
                    "concreteType": "MessageEdge",
                    "plural": true,
                    "selections": [
                      {
                        "kind": "ScalarField",
                        "alias": null,
                        "name": "cursor",
                        "args": null,
                        "storageKey": null
                      },
                      {
                        "kind": "LinkedField",
                        "alias": null,
                        "name": "node",
                        "storageKey": null,
                        "args": null,
                        "concreteType": "Message",
                        "plural": false,
                        "selections": [
                          (v2/*: any*/),
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "impulse_id",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "is_from_user",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "body",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "attachments",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Attachment",
                            "plural": true,
                            "selections": [
                              (v3/*: any*/),
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "content_type",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "download_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "file_name",
                                "args": null,
                                "storageKey": null
                              }
                            ]
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "created_at",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "from",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "MessageInitiator",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v5/*: any*/)
                            ]
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "invoice",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Invoice",
                            "plural": false,
                            "selections": [
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "payment_url",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "state",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "total",
                                "args": null,
                                "storageKey": null
                              },
                              {
                                "kind": "ScalarField",
                                "alias": null,
                                "name": "lewitt_invoice_id",
                                "args": null,
                                "storageKey": null
                              },
                              (v2/*: any*/)
                            ]
                          },
                          (v8/*: any*/)
                        ]
                      }
                    ]
                  }
                ]
              },
              {
                "kind": "LinkedHandle",
                "alias": null,
                "name": "messages",
                "args": (v7/*: any*/),
                "handle": "connection",
                "key": "Messages_messages",
                "filters": []
              },
              {
                "kind": "LinkedField",
                "alias": null,
                "name": "items",
                "storageKey": null,
                "args": null,
                "concreteType": "ConversationItem",
                "plural": true,
                "selections": [
                  {
                    "kind": "LinkedField",
                    "alias": "artwork",
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Artwork",
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v3/*: any*/),
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
                            "name": "artist_names",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "ScalarField",
                            "alias": null,
                            "name": "date",
                            "args": null,
                            "storageKey": null
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v11/*: any*/)
                          }
                        ]
                      }
                    ]
                  },
                  {
                    "kind": "LinkedField",
                    "alias": "show",
                    "name": "item",
                    "storageKey": null,
                    "args": null,
                    "concreteType": null,
                    "plural": false,
                    "selections": [
                      (v8/*: any*/),
                      (v2/*: any*/),
                      {
                        "kind": "InlineFragment",
                        "type": "Show",
                        "selections": [
                          (v9/*: any*/),
                          (v10/*: any*/),
                          (v3/*: any*/),
                          (v4/*: any*/),
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "cover_image",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Image",
                            "plural": false,
                            "selections": (v11/*: any*/)
                          },
                          {
                            "kind": "LinkedField",
                            "alias": null,
                            "name": "fair",
                            "storageKey": null,
                            "args": null,
                            "concreteType": "Fair",
                            "plural": false,
                            "selections": [
                              (v4/*: any*/),
                              (v2/*: any*/)
                            ]
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
                              (v8/*: any*/),
                              (v2/*: any*/),
                              {
                                "kind": "InlineFragment",
                                "type": "Partner",
                                "selections": [
                                  (v4/*: any*/)
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          },
          (v2/*: any*/)
        ]
      }
    ]
  },
  "params": {
    "operationKind": "query",
    "name": "MessagesQuery",
    "id": "8a4e8692f76af568a4c8b73c6306c1c0",
    "text": null,
    "metadata": {}
  }
};
})();
(node as any).hash = '8a4e8692f76af568a4c8b73c6306c1c0';
export default node;
