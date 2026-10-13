import { useState } from 'react';
import { View, Text, TextInput, StyleSheet, ScrollView, Switch, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router, useLocalSearchParams } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { MERCHANTS, type MerchantId } from '../src/data/catalog';
import { useTheme } from '../src/theme/useTheme';
import { Button } from '../src/components/Button';
import { useCardStore, useSettingsStore } from '../src/store/useStore';

const schema = z.object({
  merchantId: z.string().min(1, 'Choose a merchant'),
  amount: z
    .string()
    .min(1, 'Enter an amount')
    .refine((v) => !Number.isNaN(Number(v)) && Number(v) > 0, 'Enter an amount greater than ₹0')
    .refine((v) => Number(v) <= 10000000, 'Amount looks too large — check and retry'),
});

type Form = z.infer<typeof schema>;

export default function Purchase() {
  const t = useTheme();
  const params = useLocalSearchParams<{ merchantId?: string }>();
  const owned = useCardStore((s) => s.ownedCardIds);
  const primeMember = useSettingsStore((s) => s.primeMember);
  const setPrime = useSettingsStore((s) => s.setPrimeMember);
  const [picked, setPicked] = useState<MerchantId | ''>((params.merchantId as MerchantId) ?? '');
  const [merchantQuery, setMerchantQuery] = useState('');

  const { control, handleSubmit, setValue, formState: { errors } } = useForm<Form>({
    resolver: zodResolver(schema),
    defaultValues: { merchantId: (params.merchantId as string) ?? '', amount: '' },
  });

  const visibleMerchants = MERCHANTS.filter((m) =>
    m.name.toLowerCase().includes(merchantQuery.trim().toLowerCase()),
  );
  const pickedMerchant = MERCHANTS.find((m) => m.id === picked);

  const onSubmit = (f: Form) => {
    router.push({
      pathname: '/result',
      params: { merchantId: f.merchantId, amount: f.amount, hasPrime: primeMember ? '1' : '0' },
    });
  };

  if (owned.length === 0) {
    return (
      <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]}>
        <View style={styles.inner}>
          <Text style={[styles.title, { color: t.text }]}>Add cards first</Text>
          <Text style={[styles.sub, { color: t.textSecondary }]}>
            Save the cards you own so we can compare them for this purchase.
          </Text>
          <View style={styles.gap}><Button title="Add your cards" onPress={() => router.push('/add-cards')} /></View>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={[styles.safe, { backgroundColor: t.bg }]} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.inner} keyboardShouldPersistTaps="handled">
        <Text style={[styles.label, { color: t.textMuted }]}>MERCHANT</Text>
        <TextInput
          value={merchantQuery}
          onChangeText={setMerchantQuery}
          placeholder="Search merchants"
          placeholderTextColor={t.textMuted}
          style={[styles.search, { backgroundColor: t.surface, borderColor: t.border, color: t.text }]}
          accessibilityLabel="Search merchants"
        />
        <View style={styles.merchList}>
          {visibleMerchants.map((m) => {
            const sel = picked === m.id;
            return (
              <Pressable
                key={m.id}
                onPress={() => { setPicked(m.id); setValue('merchantId', m.id, { shouldValidate: true }); }}
                accessibilityRole="radio"
                accessibilityState={{ checked: sel }}
                accessibilityLabel={m.name}
                style={[styles.mrow, { backgroundColor: sel ? t.selectionWash : t.surface, borderColor: sel ? t.ink : t.border }]}
              >
                <View style={styles.mmain}>
                  <Text style={[styles.mname, { color: t.text }]}>{m.name}</Text>
                  <Text style={[styles.mcat, { color: t.textSecondary }]}>{m.category}</Text>
                </View>
                <View style={[styles.radio, { borderColor: sel ? t.ink : t.borderStrong, backgroundColor: sel ? t.ink : 'transparent' }]}>
                  {sel ? <Text style={styles.tick}>✓</Text> : null}
                </View>
              </Pressable>
            );
          })}
        </View>
        {errors.merchantId ? <Text style={[styles.err, { color: '#C0362C' }]}>{errors.merchantId.message}</Text> : null}

        <Text style={[styles.label, { color: t.textMuted }]}>PURCHASE AMOUNT (INR)</Text>
        <Controller
          control={control}
          name="amount"
          render={({ field: { onChange, value } }) => (
            <View style={[styles.amtWrap, { backgroundColor: t.surface, borderColor: errors.amount ? '#C0362C' : t.border }]}>
              <Text style={[styles.rs, { color: t.textMuted }]}>₹</Text>
              <TextInput
                value={value}
                onChangeText={onChange}
                placeholder="2,000"
                placeholderTextColor={t.textMuted}
                keyboardType="numeric"
                inputMode="numeric"
                returnKeyType="done"
                accessibilityLabel="Purchase amount in rupees"
                style={[styles.amt, { color: t.text }]}
              />
            </View>
          )}
        />
        {errors.amount ? <Text style={[styles.err, { color: '#C0362C' }]}>{errors.amount.message}</Text> : null}

        {pickedMerchant?.supportsPrime ? (
          <View style={[styles.prime, { backgroundColor: t.surface, borderColor: t.border }]}>
            <View style={styles.primeText}>
              <Text style={[styles.primeTitle, { color: t.text }]}>Amazon Prime member?</Text>
              <Text style={[styles.primeSub, { color: t.textSecondary }]}>Prime changes the cashback rate on Amazon.</Text>
            </View>
            <Switch value={primeMember} onValueChange={setPrime} accessibilityLabel="Prime membership" />
          </View>
        ) : null}

        <View style={styles.cta}>
          <Button title="Find Best Card" onPress={handleSubmit(onSubmit)} />
        </View>
        <Text style={[styles.note, { color: t.textMuted }]}>
          We compare {owned.length} saved card{owned.length > 1 ? 's' : ''} using verified rules. No payment is processed.
        </Text>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1 },
  inner: { padding: 20, paddingBottom: 40 },
  title: { fontSize: 22, fontWeight: '700' },
  sub: { fontSize: 14, lineHeight: 20, marginTop: 8 },
  gap: { marginTop: 20 },
  label: { fontSize: 11, fontWeight: '700', letterSpacing: 1, marginTop: 8, marginBottom: 8 },
  search: { borderWidth: 1, borderRadius: 12, height: 46, paddingHorizontal: 14, fontSize: 15 },
  merchList: { marginTop: 10, gap: 8 },
  mrow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, padding: 12 },
  mmain: { flex: 1 },
  mname: { fontSize: 15, fontWeight: '600' },
  mcat: { fontSize: 12, marginTop: 2 },
  radio: { width: 24, height: 24, borderRadius: 12, borderWidth: 1.5, alignItems: 'center', justifyContent: 'center' },
  tick: { color: '#fff', fontSize: 13, fontWeight: '700' },
  err: { fontSize: 13, marginTop: 6 },
  amtWrap: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 12, paddingHorizontal: 14, height: 56, marginTop: 4 },
  rs: { fontSize: 20, fontWeight: '700', marginRight: 8 },
  amt: { flex: 1, fontSize: 20, fontWeight: '700', fontVariant: ['tabular-nums'] },
  prime: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderRadius: 14, padding: 14, marginTop: 16, gap: 12 },
  primeText: { flex: 1 },
  primeTitle: { fontSize: 14, fontWeight: '600' },
  primeSub: { fontSize: 12, marginTop: 2 },
  cta: { marginTop: 20 },
  note: { fontSize: 12, lineHeight: 16, marginTop: 12, textAlign: 'center' },
});
