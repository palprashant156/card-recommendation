import { useMemo, useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, router } from 'expo-router';
import { MERCHANTS } from '../src/data/catalog';
import { recommend } from '../src/engine/recommend';
import { useTheme } from '../src/theme/useTheme';
import { formatINR } from '../src/theme/tokens';
import { StatusPill } from '../src/components/StatusPill';
import { Button } from '../src/components/Button';
import { useCardStore, useHistoryStore } from '../src/store/useStore';

export default function Result() {
  const t = useTheme();
  const params = useLocalSearchParams<{ merchantId?: string; amount?: string; hasPrime?: string }>();
  const owned = useCardStore((s) => s.ownedCardIds);
  const addEntry = useHistoryStore((s) => s.addEntry);
  const [showAll, setShowAll] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const savedOnce = useRef(false);

  const merchantId = (params.merchantId as string) ?? 'amazon';
  const amount = Number(params.amount ?? 0);
  const hasPrime = params.hasPrime === '1';
  const merchant = MERCHANTS.find((m) => m.id === merchantId);

  const { winner, ranked } = useMemo(
    () => recommend({ merchantId: merchantId as never, amount, cardIds: owned, hasPrime }),
    [merchantId, amount, owned, hasPrime],
  );

  useEffect(() => {
    if (winner && !savedOnce.current) {
      savedOnce.current = true;
      const label = `${winner.card.issuer} ${winner.card.product}`;
      addEntry({
        merchantId,
        merchantName: merchant?.name ?? merchantId,
        amount,
        cardId: winner.card.id,
        cardLabel: label,
        benefit: winner.totalBenefit,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!Number.isFinite(amount) || amount <= 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
        <View style={styles.inner}>
          <Text style={[styles.title, { color: t.text }]}>Missing amount</Text>
          <Button title="Enter purchase" onPress={() => router.replace('/purchase')} />
        </View>
      </SafeAreaView>
    );
  }

  if (!winner) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
        <ScrollView contentContainerStyle={styles.inner}>
          <Text style={[styles.kicker, { color: t.textMuted }]}>NO CLEAR WINNER</Text>
          <Text style={[styles.title, { color: t.text }]}>We can’t confidently recommend a card</Text>
          <Text style={[styles.sub, { color: t.textSecondary }]}>
            None of your {owned.length} saved cards has a verified benefit for {formatINR(amount)} at {merchant?.name ?? 'this merchant'}. We’d rather be honest than guess.
          </Text>
          <View style={styles.gap}><Button title="Try another purchase" onPress={() => router.replace('/purchase')} /></View>
          <View style={styles.gap}><Button title="Review offers" variant="secondary" onPress={() => router.replace('/(tabs)/offers')} /></View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  const alts = ranked.filter((r) => r.eligible && r.card.id !== winner.card.id);
  const visibleAlts = showAll ? alts : alts.slice(0, 2);

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.inner}>
        <Text style={[styles.kicker, { color: t.textMuted }]}>YOUR BEST CARD</Text>
        <View style={[styles.winner, { backgroundColor: t.surface, borderColor: t.border }]}>
          <StatusPill status={winner.status} />
          <Text style={[styles.cardName, { color: t.text }]}>{winner.card.issuer} {winner.card.product}</Text>
          <Text style={[styles.cardMeta, { color: t.textSecondary }]}>
            {winner.card.type === 'credit' ? 'Credit' : 'Debit'} · {winner.card.network} · {merchant?.name} · {formatINR(amount)}
          </Text>
          <Text style={[styles.rewardLabel, { color: t.textSecondary }]}>Estimated reward</Text>
          <Text style={[styles.reward, { color: t.positive }]}>{formatINR(winner.totalBenefit)}</Text>
          <View style={[styles.costRow, { backgroundColor: t.surfaceMuted }]}>
            <Text style={[styles.costLabel, { color: t.textSecondary }]}>Estimated effective cost</Text>
            <Text style={[styles.cost, { color: t.text }]}>{formatINR(winner.effectiveCost)}</Text>
          </View>
          <Text style={[styles.why, { color: t.text }]}>Why this card?</Text>
          <Text style={[styles.whyText, { color: t.textSecondary }]}>{winner.explanation}</Text>
        </View>

        <Pressable
          onPress={() => setExpanded((v) => !v)}
          accessibilityRole="button"
          accessibilityLabel="How we calculated this"
          style={[styles.calc, { backgroundColor: t.surface, borderColor: t.border }]}
        >
          <Text style={[styles.calcTitle, { color: t.text }]}>How we calculated this {expanded ? '▾' : '▸'}</Text>
          {expanded ? (
            <View style={styles.calcBody}>
              <CalcRow label="Purchase amount" value={formatINR(amount)} />
              <CalcRow label={winner.breakdown.kind === 'instant_discount' ? 'Instant discount' : winner.breakdown.kind === 'cashback' ? 'Estimated cashback' : 'Reward-point value'} value={`+${formatINR(winner.totalBenefit)}`} />
              <CalcRow label="Rate applied" value={`${winner.breakdown.rateAppliedPct}%`} />
              {winner.breakdown.capApplied ? <CalcRow label="Cap per transaction" value={formatINR(winner.breakdown.capApplied)} /> : null}
              <CalcRow label="Offer valid till" value={winner.breakdown.validTill || '—'} />
              <CalcRow label="Verification" value={winner.status === 'verified' ? 'Verified source on file' : winner.status === 'estimated' ? 'Estimated — redemption varies' : 'Needs verification'} />
              {winner.breakdown.exclusionNote ? (
                <Text style={[styles.excl, { color: t.textSecondary }]}>{winner.breakdown.exclusionNote}</Text>
              ) : null}
              <Text style={[styles.excl, { color: t.textMuted }]}>Estimates only — final benefit depends on bank settlement and eligibility.</Text>
            </View>
          ) : null}
        </Pressable>

        {alts.length > 0 ? (
          <View style={styles.alts}>
            <Text style={[styles.altsTitle, { color: t.text }]}>Also good</Text>
            {visibleAlts.map((a) => (
              <View key={a.card.id} style={[styles.altRow, { backgroundColor: t.surface, borderColor: t.border }]}>
                <View style={styles.altMain}>
                  <Text style={[styles.altName, { color: t.text }]}>{a.card.issuer} {a.card.product}</Text>
                  <StatusPill status={a.status} />
                </View>
                <Text style={[styles.altAmt, { color: t.text }]}>+{formatINR(a.totalBenefit)}</Text>
              </View>
            ))}
            {alts.length > 2 ? (
              <Pressable onPress={() => setShowAll((v) => !v)} accessibilityRole="button">
                <Text style={[styles.link, { color: t.text }]}>{showAll ? 'Show fewer' : `View all ${alts.length} alternatives`}</Text>
              </Pressable>
            ) : null}
          </View>
        ) : null}

        <View style={styles.cta}>
          <Button title="New purchase" variant="secondary" onPress={() => router.replace('/purchase')} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function CalcRow({ label, value }: { label: string; value: string }) {
  const t = useTheme();
  return (
    <View style={styles.calcRow}>
      <Text style={[styles.calcLabel, { color: t.textSecondary }]}>{label}</Text>
      <Text style={[styles.calcValue, { color: t.text }]}>{value}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  kicker: { fontSize: 11, fontWeight: '700', letterSpacing: 1.2 },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 28, marginTop: 8 },
  sub: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  gap: { marginTop: 12 },
  winner: { borderWidth: 1, borderRadius: 20, padding: 18, marginTop: 12 },
  cardName: { fontSize: 19, fontWeight: '700', lineHeight: 24, marginTop: 12 },
  cardMeta: { fontSize: 12, marginTop: 4 },
  rewardLabel: { fontSize: 12, fontWeight: '600', marginTop: 16 },
  reward: { fontSize: 34, lineHeight: 40, fontWeight: '700', fontVariant: ['tabular-nums'] },
  costRow: { borderRadius: 12, padding: 12, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  costLabel: { fontSize: 13 },
  cost: { fontSize: 18, fontWeight: '700', fontVariant: ['tabular-nums'] },
  why: { fontSize: 14, fontWeight: '700', marginTop: 16 },
  whyText: { fontSize: 14, lineHeight: 20, marginTop: 6 },
  calc: { borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 12 },
  calcTitle: { fontSize: 14, fontWeight: '700' },
  calcBody: { marginTop: 12, gap: 8 },
  calcRow: { flexDirection: 'row', justifyContent: 'space-between' },
  calcLabel: { fontSize: 13 },
  calcValue: { fontSize: 13, fontWeight: '700', fontVariant: ['tabular-nums'] },
  excl: { fontSize: 12, lineHeight: 16, marginTop: 4 },
  alts: { marginTop: 24 },
  altsTitle: { fontSize: 15, fontWeight: '700', marginBottom: 10 },
  altRow: { borderWidth: 1, borderRadius: 14, padding: 14, flexDirection: 'row', alignItems: 'center', marginBottom: 8, gap: 12 },
  altMain: { flex: 1, gap: 6 },
  altName: { fontSize: 14, fontWeight: '600' },
  altAmt: { fontSize: 15, fontWeight: '700', fontVariant: ['tabular-nums'] },
  link: { fontSize: 14, fontWeight: '600', marginTop: 6 },
  cta: { marginTop: 24 },
});
