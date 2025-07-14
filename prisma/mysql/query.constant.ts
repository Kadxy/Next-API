import { Prisma } from '@prisma-mysql-client/client';

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
  creatorId: true,
  walletId: true,
  isDeleted: true,
};

// -- WALLET --
export const OWNER_WALLET_QUERY_OMIT: Prisma.WalletOmit = {
  id: true,
  ownerId: true,
  version: true,
};

export const OWNER_WALLET_QUERY_WALLET_MEMBER_SELECT: Prisma.WalletMemberSelect =
  {
    alias: true,
    creditLimit: true,
    creditUsed: true,
    isActive: true,
    user: { select: { uid: true, displayName: true, avatar: true } },
  };

// 简单钱包查询，一般用于前端生成 options
export const SIMPLE_WALLET_QUERY_SELECT: Prisma.WalletSelect = {
  uid: true,
  balance: true,
  displayName: true,
  owner: { select: { uid: true, displayName: true, avatar: true } },
};

export const APIKEY_INCLUDE_WALLET_SELECT: Prisma.WalletSelect = {
  uid: true,
  displayName: true,
};

// -- API CALL RECORD --
export const API_CALL_RECORD_QUERY_OMIT: Prisma.ApiCallRecordOmit = {
  walletId: true,
  userId: true,
  apikeyId: true,
};

export const API_CALL_RECORD_LIST_SELECT: Prisma.ApiCallRecordSelect = {
  requestId: true,
  model: true,
  startTime: true,
  endTime: true,
  durationMs: true,
  inputToken: true,
  outputToken: true,
  cost: true,
  billStatus: true,
  errorMessage: true,
  createdAt: true,
  wallet: {
    select: {
      uid: true,
    },
  },
};

export const API_CALL_RECORD_DETAIL_SELECT: Prisma.ApiCallRecordSelect = {
  ...API_CALL_RECORD_LIST_SELECT,
  clientIp: true,
  externalTraceId: true,
};
