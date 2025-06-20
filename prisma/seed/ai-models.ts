import { AIModel } from '@prisma-client';
import { Decimal } from '@prisma/client/runtime/library';

enum providers {
  Others,
  OpenAI,
  Anthropic,
  Deepseek,
}

type Unit = 'k' | 'm';
type SeedAIModel = Omit<AIModel, 'id' | 'isActive' | 'createdAt' | 'updatedAt'>;

const getPrice = (price: number, unit: Unit) => {
  const convert: Record<Unit, Decimal> = {
    k: new Decimal(1000),
    m: new Decimal(1000000),
  };

  return new Decimal(price).div(convert[unit]);
};

export const aiModels: SeedAIModel[] = [
  {
    name: 'gpt-4o-mini',
    providerId: providers.OpenAI,
    inputPrice: getPrice(2.5, 'k'),
    outputPrice: getPrice(5, 'm'),
  },
  {
    name: 'deepseek-r1',
    providerId: providers.Deepseek,
    inputPrice: getPrice(10, 'k'),
    outputPrice: getPrice(20, 'm'),
  },
];
