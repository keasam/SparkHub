import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Paywall() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.content}>
        <Text style={styles.kicker}>FULL EVALUATION</Text>
        <Text style={styles.title}>Turn your score into a plan.</Text>
        <Text style={styles.subtitle}>Unlock the complete analysis built from your idea, your answers, your documents, and the market context available to the evaluator.</Text>

        <View style={styles.priceCard}>
          <Text style={styles.small}>ONE-TIME ACCESS</Text>
          <View style={styles.priceLine}><Text style={styles.price}>₹199</Text><Text style={styles.priceNote}> per evaluation</Text></View>
        </View>

        <View style={styles.list}>
          <Benefit text="Full Idea DNA score and dimensions" />
          <Benefit text="Market and competitor analysis" />
          <Benefit text="Key risks, gaps, and opportunities" />
          <Benefit text="Blueprint, pathway, and recommended next steps" />
          <Benefit text="Detailed reasoning behind your evaluation" />
        </View>

        <Pressable style={styles.primary} onPress={() => router.replace('/full-report')}>
          <Text style={styles.primaryText}>Pay ₹199 & unlock</Text><Text style={styles.arrow}>→</Text>
        </Pressable>
        <Pressable onPress={() => router.back()}><Text style={styles.back}>Not now</Text></Pressable>
      </View>
    </SafeAreaView>
  );
}

function Benefit({ text }: { text: string }) {
  return <View style={styles.benefit}><Text style={styles.check}>✓</Text><Text style={styles.benefitText}>{text}</Text></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { flex: 1, padding: 24, justifyContent: 'center' },
  kicker: { color: '#4F46E5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#111111', fontSize: 33, lineHeight: 38, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#6D6A63', fontSize: 14, lineHeight: 21, marginTop: 10 },
  priceCard: { backgroundColor: '#111111', borderRadius: 22, padding: 20, marginTop: 24 },
  small: { color: '#AFAAA0', fontSize: 10, letterSpacing: 1.4, fontWeight: '800' },
  priceLine: { flexDirection: 'row', alignItems: 'baseline', marginTop: 4 },
  price: { color: '#FFFFFF', fontSize: 47, fontWeight: '800' },
  priceNote: { color: '#B6B1A8', fontSize: 12, marginLeft: 6 },
  list: { marginTop: 22, gap: 12 },
  benefit: { flexDirection: 'row', alignItems: 'center' },
  check: { width: 24, height: 24, textAlign: 'center', textAlignVertical: 'center', borderRadius: 12, backgroundColor: '#EEEDFF', color: '#4F46E5', fontWeight: '800', overflow: 'hidden' },
  benefitText: { color: '#3F3D38', fontSize: 13, marginLeft: 9, flex: 1 },
  primary: { marginTop: 28, backgroundColor: '#4F46E5', borderRadius: 17, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  back: { textAlign: 'center', color: '#87837A', fontSize: 13, marginTop: 14, paddingVertical: 10 },
});
