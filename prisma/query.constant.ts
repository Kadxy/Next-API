import { Prisma } from './generated';

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
};

// -- WALLET --
export const OWNER_WALLET_QUERY_OMIT: Prisma.WalletOmit = {
  id: true,
  ownerId: true,
  version: true,
};

export const OWNER_WALLET_QUERY_WALLETMEMBER_SELECT: Prisma.WalletMemberSelect =
  {
    alias: true,
    creditLimit: true,
    creditUsed: true,
    user: { select: { uid: true, displayName: true } },
  };

// 简单钱包查询，一般用于前端生成 options
export const SIMPLE_WALLET_QUERY_SELECT: Prisma.WalletSelect = {
  uid: true,
  balance: true,
  displayName: true,
};

export const APIKEY_INCLUDE_WALLET_SELECT: Prisma.WalletSelect = {
  uid: true,
  displayName: true,
};
