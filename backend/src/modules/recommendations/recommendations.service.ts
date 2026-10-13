import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../common/prisma.service';
import { recommend } from './engine';
import { RecommendDto } from './dto';

@Injectable()
export class RecommendationsService {
  constructor(private prisma: PrismaService) {}

  private fallbackCards() {
    return [];
  }

  async recommend(dto: RecommendDto) {
    const [cards, rules, merchant] = await Promise.all([
      this.prisma.cardProduct.findMany({ where: { id: { in: dto.cardIds } } }).catch(() => this.fallbackCards()),
      this.prisma.rewardRule.findMany({ where: { cardId: { in: dto.cardIds } } }).catch(() => []),
      this.prisma.merchant.findUnique({ where: { id: dto.merchantId } }).catch(() => null),
    ]);
    return recommend({
      merchantId: dto.merchantId,
      merchantName: merchant?.name ?? dto.merchantId,
      amount: dto.amount,
      cardIds: dto.cardIds,
      cards: cards.map((c: { id: string; issuer: string; product: string; network: string; type: string }) => ({
        id: c.id, issuer: c.issuer, product: c.product, network: c.network, type: c.type,
      })),
      rules: rules.map((r: { id: string; cardId: string; merchantId: string; kind: string; ratePct: number; primeRatePct?: number | null; capPerTxn?: number | null; minTxn?: number | null; validTill: string; verified: boolean; exclusionNote?: string | null }) => ({
        id: r.id, cardId: r.cardId, merchantId: r.merchantId,
        kind: r.kind as 'instant_discount' | 'cashback' | 'reward_points',
        ratePct: Number(r.ratePct), primeRatePct: r.primeRatePct != null ? Number(r.primeRatePct) : null,
        capPerTxn: r.capPerTxn != null ? Number(r.capPerTxn) : null,
        minTxn: r.minTxn != null ? Number(r.minTxn) : null,
        validTill: r.validTill, verified: r.verified, exclusionNote: r.exclusionNote,
      })),
      hasPrime: dto.hasPrime,
    });
  }
}
