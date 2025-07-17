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
export interface AIModelNonStreamResponse {
  id?: string;
  model?: string;
  object?: string;
  created?: number;
  choices?: {
    index: number;
    message: {
      role?: string | 'assistant';
      content?: string;
      reasoning_content?: string;
    };
    finish_reason: string | 'stop';
  }[];
  system_fingerprint?: string;
  usage?: AIModelUsage;
  [key: string]: any;
}

export interface AIModelStreamResponse {
  id?: string;
  object?: string;
  created?: number;
  model?: string;
  choices?: {
    index?: number;
    delta?: {
      role?: string | 'assistant';
      content?: string;
      reasoning_content?: string;
    };
  }[];
  usage?: AIModelUsage;
}

export interface AIModelUsage {
  prompt_tokens?: number; // ✅ 取这个
  completion_tokens?: number; // ✅ 取这个
  total_tokens?: number;
  input_tokens?: number; // ❌ 不取这个
  output_tokens?: number; // ❌ 不取这个
  input_tokens_details?: any;
  prompt_tokens_details?: {
    cached_tokens?: number;
    audio_tokens?: number;
  };
  completion_tokens_details?: {
    reasoning_tokens?: number;
    audio_tokens?: number;
    accepted_prediction_tokens?: number;
    rejected_prediction_tokens?: number;
  };
}
