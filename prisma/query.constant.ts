import { Prisma } from './generated/prisma/client';

// -- USER --
export const USER_QUERY_OMIT: Prisma.UserOmit = {
  id: true,
  isDeleted: true,
};

export const USER_QUERY_INCLUDE: Prisma.UserInclude = {
  wallet: { select: { balance: true } },
};

// -- API KEY --
export const API_KEY_QUERY_OMIT: Prisma.ApiKeyOmit = {
  id: true,
};
