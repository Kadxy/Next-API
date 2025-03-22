// 基础消息接口
export interface FeishuMessageInterface {
  msg_type: 'text' | 'post' | 'share_chat' | 'interactive';
  content: any;
}

// 文本消息
export interface FeishuTextMessage extends FeishuMessageInterface {
  msg_type: 'text';
  content: {
    text: string;
  };
}

// 富文本节点类型
type PostNode =
  | {
      tag: 'text';
      text: string;
      un_escape?: boolean;
    }
  | {
      tag: 'a';
      text: string;
      href: string;
    }
  | {
      tag: 'at';
      user_id: string;
      user_name?: string;
    }
  | {
      tag: 'img';
      image_key: string;
    };

// 富文本内容
export interface PostContent {
  title?: string;
  content: PostNode[][];
}

// 富文本消息
export interface FeishuPostMessage extends FeishuMessageInterface {
  msg_type: 'post';
  content: {
    post: {
      zh_cn?: PostContent;
      en_us?: PostContent;
    };
  };
}
