import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Home() {
  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.badge}><Text style={styles.badgeText}>SPARKHUB</Text></View>
        <Text style={styles.eyebrow}>IDEA → IPO</Text>
        <Text style={styles.title}>Your idea has potential. Let’s test it.</Text>
        <Text style={styles.subtitle}>
          Submit your idea and supporting material. We’ll challenge your thinking with 9 personalized questions, 60 seconds each, then build your evaluation.
        </Text>

        <View style={styles.card}>
          <Text style={styles.cardTitle}>What happens?</Text>
          <Text style={styles.step}>01  Share your idea + documents</Text>
          <Text style={styles.step}>02  Answer 9 AI-generated questions</Text>
          <Text style={styles.step}>03  Get your market-backed evaluation</Text>
        </View>

        <Pressable style={styles.primary} onPress={() => router.push('/idea')}>
          <Text style={styles.primaryText}>Evaluate my idea</Text>
          <Text style={styles.arrow}>→</Text>
        </Pressable>
        <Text style={styles.note}>9 questions · 60 seconds each · Full evaluation ₹199</Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { flex: 1, padding: 24, justifyContent: 'center' },
  badge: { alignSelf: 'flex-start', backgroundColor: '#111111', paddingHorizontal: 12, paddingVertical: 7, borderRadius: 999, marginBottom: 28 },
  badgeText: { color: '#FFFFFF', fontSize: 11, fontWeight: '800', letterSpacing: 1.2 },
  eyebrow: { color: '#4F46E5', fontWeight: '800', fontSize: 13, letterSpacing: 2, marginBottom: 10 },
  title: { color: '#111111', fontSize: 42, lineHeight: 46, fontWeight: '800', letterSpacing: -1.5 },
  subtitle: { color: '#66645F', fontSize: 16, lineHeight: 24, marginTop: 16 },
  card: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E7E4DC', borderRadius: 22, padding: 18, marginTop: 28, gap: 12 },
  cardTitle: { fontSize: 14, fontWeight: '800', color: '#111111', marginBottom: 2 },
  step: { color: '#494742', fontSize: 14, lineHeight: 20 },
  primary: { marginTop: 24, backgroundColor: '#4F46E5', borderRadius: 18, paddingVertical: 17, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
  note: { color: '#89867F', textAlign: 'center', marginTop: 12, fontSize: 12 },
});
