import { AIModel, AIModelChannel, PrismaClient } from '../generated';
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
type SeedAIModelChannel = Omit<
  AIModelChannel,
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
    name: 'deepseek-r1',
    providerId: providers.Deepseek,
    inputPrice: getPrice(1, 'm'), // $1.00 per 1M tokens
    outputPrice: getPrice(3, 'm'), // $3.00 per 1M tokens
  },
];

const aiModelChannels: SeedAIModelChannel[] = [
  {
    name: 'openai-next-1',
    weight: 100,
    baseUrl: 'https://api.openai-next.com',
    apiKey: 'sk-1234567890',
  },
];

async function main() {
  await prisma.aIModel.createMany({
    data: aiModels,
  });

  await prisma.aIModelChannel.createMany({
    data: aiModelChannels,
  });

  console.log('✅ Seed data created successfully');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
