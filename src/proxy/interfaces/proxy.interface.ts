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
  [key: string]: any;
}

// 代理配置接口
export interface ProxyConfig {
  timeout?: number;
  retryCount?: number;
  retryDelay?: number;
}

// 上游服务配置
export interface UpstreamConfig {
  id: number;
  baseUrl: string;
  apiKey: string;
  weight: number;
}
