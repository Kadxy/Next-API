import { Module } from '@nestjs/common';
import { OpenAIModule } from './openai/openai.module';

@Module({
  imports: [OpenAIModule, ],
  exports: [OpenAIModule, ],
})
export class ProxyModule {}
