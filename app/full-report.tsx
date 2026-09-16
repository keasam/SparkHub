import { router } from 'expo-router';
import { ScrollView, StyleSheet, Text, View, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const dimensions = [
  { title: 'Problem strength', score: 84, body: 'The problem is clearly articulated and appears meaningful for the target customer.' },
  { title: 'Market signal', score: 78, body: 'There are signs of demand, but customer validation and market sizing need deeper evidence.' },
  { title: 'Differentiation', score: 73, body: 'Your positioning has a point of difference, though several alternatives compete for the same customer.' },
  { title: 'Execution readiness', score: 81, body: 'The plan is understandable and actionable, with a few capability and distribution questions to solve.' },
];

export default function FullReport() {
  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.header}><Text style={styles.kicker}>FULL DOSSIER</Text><Text style={styles.unlocked}>UNLOCKED</Text></View>
        <Text style={styles.title}>Your idea has a path forward.</Text>
        <Text style={styles.subtitle}>This report brings together the assessment signal, idea context, and market-oriented evaluation.</Text>

        <View style={styles.hero}><Text style={styles.heroLabel}>IDEA DNA</Text><Text style={styles.heroScore}>78</Text><Text style={styles.heroSub}>preliminary composite evaluation</Text></View>

        <Section title="Score breakdown">
          {dimensions.map((item) => <View style={styles.dim} key={item.title}><View style={styles.dimTop}><Text style={styles.dimTitle}>{item.title}</Text><Text style={styles.dimScore}>{item.score}</Text></View><Text style={styles.dimBody}>{item.body}</Text></View>)}
        </Section>

        <Section title="Discovery">
          <Text style={styles.body}>Your strongest signal is problem understanding. The biggest open question is whether the target customer will change current behavior fast enough to support your planned growth.</Text>
        </Section>

        <Section title="Pathway">
          <Step n="01" title="Validate the customer" body="Interview a focused first segment and test willingness to adopt the proposed solution." />
          <Step n="02" title="Test differentiation" body="Compare the proposed experience directly with the strongest existing alternative." />
          <Step n="03" title="Run a paid experiment" body="Use a small cohort to test the actual commercial behavior rather than stated interest." />
        </Section>

        <Section title="Blueprint">
          <View style={styles.blueprint}><Text style={styles.blueprintTitle}>Next move</Text><Text style={styles.blueprintText}>Turn your riskiest assumption into a measurable experiment. The goal is to learn what would make a customer act, not just agree.</Text></View>
        </Section>

        <View style={styles.note}><Text style={styles.noteTitle}>Human review</Text><Text style={styles.noteText}>Your evaluation can be reviewed by the SparkHub team for deeper assessment.</Text></View>
        <Pressable onPress={() => router.replace('/')} style={styles.secondary}><Text style={styles.secondaryText}>Back to SparkHub</Text></Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <View style={styles.section}><Text style={styles.sectionTitle}>{title}</Text>{children}</View>;
}
function Step({ n, title, body }: { n: string; title: string; body: string }) {
  return <View style={styles.step}><Text style={styles.stepNum}>{n}</Text><View style={{ flex: 1 }}><Text style={styles.stepTitle}>{title}</Text><Text style={styles.stepBody}>{body}</Text></View></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24, paddingBottom: 45 },
  header: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
  kicker: { color: '#4F46E5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  unlocked: { color: '#6D6A63', fontSize: 10, fontWeight: '800', letterSpacing: 1.2 },
  title: { color: '#111111', fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#6D6A63', fontSize: 14, lineHeight: 21, marginTop: 9 },
  hero: { marginTop: 22, backgroundColor: '#111111', borderRadius: 24, padding: 22 },
  heroLabel: { color: '#B8B3AB', fontSize: 10, fontWeight: '800', letterSpacing: 1.4 },
  heroScore: { color: '#FFFFFF', fontSize: 61, lineHeight: 66, fontWeight: '800', marginTop: 3 },
  heroSub: { color: '#B8B3AB', fontSize: 11 },
  section: { marginTop: 27 },
  sectionTitle: { color: '#171714', fontSize: 18, fontWeight: '800', marginBottom: 12 },
  dim: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E1DED6', borderRadius: 16, padding: 15, marginBottom: 9 },
  dimTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dimTitle: { color: '#37352F', fontSize: 13, fontWeight: '800' },
  dimScore: { color: '#4F46E5', fontSize: 16, fontWeight: '800' },
  dimBody: { color: '#77736B', fontSize: 12, lineHeight: 18, marginTop: 6 },
  body: { color: '#5E5B54', fontSize: 14, lineHeight: 22 },
  step: { flexDirection: 'row', gap: 12, marginBottom: 16 },
  stepNum: { color: '#4F46E5', fontSize: 12, fontWeight: '800', width: 25, paddingTop: 1 },
  stepTitle: { color: '#28261F', fontSize: 14, fontWeight: '800' },
  stepBody: { color: '#77736B', fontSize: 12, lineHeight: 18, marginTop: 4 },
  blueprint: { backgroundColor: '#EEEDFF', borderRadius: 18, padding: 17 },
  blueprintTitle: { color: '#2E2A69', fontWeight: '800', fontSize: 14 },
  blueprintText: { color: '#5B5680', fontSize: 13, lineHeight: 19, marginTop: 6 },
  note: { marginTop: 27, borderTopWidth: 1, borderTopColor: '#DFDCD4', paddingTop: 18 },
  noteTitle: { color: '#35322C', fontSize: 13, fontWeight: '800' },
  noteText: { color: '#77736B', fontSize: 12, lineHeight: 18, marginTop: 5 },
  secondary: { marginTop: 18, paddingVertical: 15, borderWidth: 1, borderColor: '#DAD6CE', borderRadius: 16, alignItems: 'center' },
  secondaryText: { color: '#37352F', fontWeight: '800', fontSize: 13 },
});
