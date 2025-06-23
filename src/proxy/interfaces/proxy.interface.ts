// AI模型请求接口
export interface AIModelRequest {
  model: string;
  stream?: boolean;
  messages: {
    role: string;
    content:
      | string
      | { type: string; text?: string; image_url?: { url: string } }[];
    name?: string;
  }[];
  tools?: any[];
  [key: string]: any;
}

// AI模型响应接口
export interface AIModelResponse {
  id?: string;
  model?: string;
  usage?: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
  choices?: any[];
  [key: string]: any;
}
