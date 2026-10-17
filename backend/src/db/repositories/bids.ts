import prisma from '../prisma';
import { Prisma } from '@prisma/client';

export async function findByAuction(auctionId: bigint, limit = 100) {
  return prisma.bid.findMany({
    where: { auctionId },
    orderBy: { amountStroops: 'desc' },
    take: limit,
  });
}

export async function findByBidder(bidder: string, limit = 20) {
  return prisma.bid.findMany({
    where: { bidder },
    orderBy: { timestamp: 'desc' },
    take: limit,
  });
}

export async function create(data: Prisma.BidCreateInput) {
  return prisma.bid.create({ data });
}
