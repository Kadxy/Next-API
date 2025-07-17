// FishAudio TTS请求接口
export interface ServeReferenceAudio {
  audio: Buffer; // 参考音频数据
  text: string; // 参考音频对应的文本
}

export interface FishAudioTTSRequest {
  text: string; // 要转换的文本
  chunk_length?: number; // 分块长度，100-300之间，默认200
  format?: 'wav' | 'pcm' | 'mp3'; // 音频格式，默认mp3
  mp3_bitrate?: 64 | 128 | 192; // MP3比特率，默认128
  references?: ServeReferenceAudio[]; // 参考音频列表（用于语音克隆）
  reference_id?: string; // 参考ID（用于预设语音）
  normalize?: boolean; // 是否标准化文本，默认true
  latency?: 'normal' | 'balanced'; // 延迟模式，默认normal
}

// FishAudio TTS响应类型（流式音频数据）
export type FishAudioTTSResponse = NodeJS.ReadableStream;

// 模型列表响应
export interface FishAudioModelsResponse {
  models: Array<{
    id: string;
    name: string;
    description?: string;
  }>;
}

// FishAudio支持的TTS模型
export const FISHAUDIO_TTS_MODELS = {
  'speech-1.5': 'speech-1.5',
  'speech-1.6': 'speech-1.6',
  s1: 's1',
} as const;

export type FishAudioModel = keyof typeof FISHAUDIO_TTS_MODELS;

// FishAudio ASR (Speech to Text) 请求接口
export interface FishAudioASRRequest {
  audio: Buffer; // 音频文件数据
  language?: string; // 语言代码，如 "en", "zh" 等
  ignore_timestamps?: boolean; // 是否忽略精确时间戳，默认true
}

// FishAudio ASR 响应接口
export interface FishAudioASRResponse {
  text: string; // 转录的文本
  duration: number; // 音频时长（秒）
  segments: Array<{
    text: string; // 片段文本
    start: number; // 开始时间
    end: number; // 结束时间
  }>;
}

// 模型管理相关接口
export interface FishAudioModelRequest {
  type: 'tts';
  title: string;
  train_mode: 'fast';
  voices: Buffer[]; // 语音文件数组
  visibility?: 'public' | 'unlist' | 'private';
  description?: string;
  cover_image?: Buffer;
  texts?: string[]; // 对应语音的文本
  tags?: string[];
  enhance_audio_quality?: boolean;
}

export interface FishAudioModelResponse {
  _id: string;
  type: 'svc' | 'tts';
  title: string;
  description: string;
  cover_image: string;
  state: 'created' | 'training' | 'trained' | 'failed';
  tags: string[];
  created_at: string;
  updated_at: string;
  visibility: 'public' | 'unlist' | 'private';
  like_count: number;
  mark_count: number;
  shared_count: number;
  task_count: number;
  author: {
    _id: string;
    username: string;
    // ... 其他作者信息
  };
  train_mode: 'fast' | 'full';
  samples: any[];
  languages: string[];
  lock_visibility: boolean;
  unliked: boolean;
  liked: boolean;
  marked: boolean;
}
