import { router } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dimensions = [
  ['Problem strength', '84'],
  ['Market signal', '78'],
  ['Differentiation', '73'],
  ['Execution readiness', '81'],
];

export default function Result() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <Text style={styles.kicker}>YOUR FIRST SIGNAL</Text>
        <Text style={styles.title}>There’s something worth exploring here.</Text>
        <Text style={styles.lead}>Your responses show a strong understanding of the problem — but we found areas where the idea needs deeper validation.</Text>

        <View style={styles.scoreCard}>
          <Text style={styles.scoreLabel}>IDEA DNA</Text>
          <Text style={styles.score}>78</Text>
          <Text style={styles.scoreSub}>/ 100 preliminary evaluation</Text>
        </View>

        {dimensions.map(([label, value]) => (
          <View style={styles.row} key={label}>
            <Text style={styles.rowLabel}>{label}</Text><Text style={styles.rowValue}>{value}</Text>
          </View>
        ))}

        <View style={styles.locked}>
          <Text style={styles.lockTitle}>Your full evaluation is ready.</Text>
          <Text style={styles.lockText}>See the market analysis, competitive landscape, key risks, personalized blueprint, pathway and detailed reasoning behind your score.</Text>
          <View style={styles.perks}><Text>✓ Full score breakdown</Text><Text>✓ Market + competitor analysis</Text><Text>✓ Risks + opportunities</Text><Text>✓ Idea Blueprint + next steps</Text></View>
          <Pressable style={styles.primary} onPress={() => router.push('/paywall')}><Text style={styles.primaryText}>Unlock full evaluation · ₹199</Text><Text style={styles.arrow}>→</Text></Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24, paddingBottom: 42 },
  kicker: { color: '#4F46E5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6, marginBottom: 10 },
  title: { color: '#111111', fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 },
  lead: { color: '#69665F', fontSize: 15, lineHeight: 23, marginTop: 12 },
  scoreCard: { backgroundColor: '#111111', borderRadius: 24, padding: 22, marginTop: 28, marginBottom: 18 },
  scoreLabel: { color: '#BDB9B1', fontSize: 11, fontWeight: '800', letterSpacing: 1.4 },
  score: { color: '#FFFFFF', fontSize: 58, lineHeight: 62, fontWeight: '800', marginTop: 4 },
  scoreSub: { color: '#BDB9B1', fontSize: 12 },
  row: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E4E1D9', borderRadius: 15, padding: 15, flexDirection: 'row', justifyContent: 'space-between', marginBottom: 9 },
  rowLabel: { color: '#44413B', fontSize: 13, fontWeight: '700' },
  rowValue: { color: '#111111', fontSize: 14, fontWeight: '800' },
  locked: { marginTop: 20, borderRadius: 22, backgroundColor: '#EEEDFF', padding: 19 },
  lockTitle: { color: '#26215E', fontSize: 19, fontWeight: '800' },
  lockText: { color: '#59547A', fontSize: 13, lineHeight: 19, marginTop: 8 },
  perks: { marginTop: 14, gap: 7 },
  primary: { backgroundColor: '#4F46E5', borderRadius: 17, paddingVertical: 16, paddingHorizontal: 17, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 18 },
  primaryText: { color: '#FFFFFF', fontSize: 14, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
});
