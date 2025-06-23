// AI模型请求接口
export interface AIModelRequest {
  model: string;
  messages: any[];
  stream?: boolean;
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
