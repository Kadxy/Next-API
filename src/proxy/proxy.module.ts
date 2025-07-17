import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/openai.module';
import { FishAudioModule } from './fishaudio/fishaudio.module';

@Module({
  imports: [OpenAIModule, FishAudioModule],
  exports: [OpenAIModule, FishAudioModule],
})
export class ProxyModule {}
