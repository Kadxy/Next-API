import { AIModel, PrismaClient, UpstreamConfig } from '../generated/client';
import { Decimal } from '@prisma/client/runtime/library';
import * as dotenv from 'dotenv';

// 加载 .env 文件
dotenv.config();

enum providers {
  Others,
  OpenAI,
  Anthropic,
  Deepseek,
}

type Unit = 'k' | 'm';
type SeedAIModel = Omit<AIModel, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;
type SeedUpstreamConfig = Omit<
  UpstreamConfig,
  'id' | 'createdAt' | 'updatedAt'
>;

const prisma = new PrismaClient();

const getPrice = (price: number, unit: Unit) => {
  const convert: Record<Unit, Decimal> = {
    k: new Decimal(1000),
    m: new Decimal(1000000),
  };

  return new Decimal(price).div(convert[unit]);
};

const aiModels: SeedAIModel[] = [
  {
    name: 'gpt-4o-mini',
    providerId: providers.OpenAI,
    inputPrice: getPrice(0.15, 'm'), // $0.15 per 1M tokens
    outputPrice: getPrice(0.6, 'm'), // $0.60 per 1M tokens
  },
  {
    name: 'gpt-4.1',
    providerId: providers.OpenAI,
    inputPrice: getPrice(2, 'm'), // $0.15 per 1M tokens
    outputPrice: getPrice(4, 'm'), // $0.60 per 1M tokens
  },
  {
    name: 'deepseek-r1',
    providerId: providers.Deepseek,
    inputPrice: getPrice(1, 'm'), // $1.00 per 1M tokens
    outputPrice: getPrice(3, 'm'), // $3.00 per 1M tokens
  },
];

const upstreamConfigs: SeedUpstreamConfig[] = [
  {
    name: 'openai-next-1',
    weight: 20,
    baseUrl: 'https://api.openai-next.com',
    apiKey: 'sk-1234567890',
  },
  {
    name: 'openai-next-2',
    weight: 10,
    baseUrl: 'https://api.openai-next.com',
    apiKey: 'sk-muHpR82P4qyo8Frq0cCf8593C2Af448bA2CaE0143a169d39',
  },
  {
    name: 'test-upstream',
    weight: 30,
    baseUrl: 'https://api.test-upstream.com',
    apiKey: 'sk-1234567890',
  },
];

async function main() {
  await Promise.all([
    aiModels.map(async (aiModel, index) => {
      console.log(`🔄 AI Model ${index + 1}/${aiModels.length}`);
      await prisma.aIModel.upsert({
        where: { name: aiModel.name },
        update: aiModel,
        create: aiModel,
      });
    }),

    upstreamConfigs.map(async (upstreamConfig, index) => {
      console.log(`🔄 Upstream Config ${index + 1}/${upstreamConfigs.length}`);
      await prisma.upstreamConfig.upsert({
        where: { name: upstreamConfig.name },
        update: upstreamConfig,
        create: upstreamConfig,
      });
    }),
  ]);

  console.log('✅ Seed data created successfully');
}

main()
  .then(async () => await prisma.$disconnect())
  .catch(async (e) => {
    console.error(e.message);
    console.error(e.stack);
    await prisma.$disconnect();
    process.exit(1);
  });
