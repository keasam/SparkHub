import { router } from 'expo-router';
import * as DocumentPicker from 'expo-document-picker';
import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function Idea() {
  const [idea, setIdea] = useState('');
  const [problem, setProblem] = useState('');
  const [customer, setCustomer] = useState('');
  const [documents, setDocuments] = useState<string[]>([]);

  async function addDocument() {
    const result = await DocumentPicker.getDocumentAsync({ multiple: true, copyToCacheDirectory: true });
    if (!result.canceled) setDocuments(result.assets.map((asset) => asset.name));
  }

  const canContinue = idea.trim().length >= 20 && problem.trim().length >= 10;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.top}><Text style={styles.kicker}>STEP 01</Text><Text style={styles.count}>IDEA INTAKE</Text></View>
        <Text style={styles.title}>Tell us what you want to build.</Text>
        <Text style={styles.subtitle}>Give the evaluator enough context to challenge the idea intelligently.</Text>

        <Field label="What is your idea?" value={idea} onChangeText={setIdea} placeholder="Describe the product, service, or business in your own words..." multiline />
        <Field label="What problem does it solve?" value={problem} onChangeText={setProblem} placeholder="Who has this problem and why does it matter?" multiline />
        <Field label="Who is it for?" value={customer} onChangeText={setCustomer} placeholder="Your target customer or user" />

        <View style={styles.uploadCard}>
          <View style={{ flex: 1 }}>
            <Text style={styles.cardTitle}>Supporting documents</Text>
            <Text style={styles.cardText}>Business plan, deck, research, notes, or any material that helps explain the idea.</Text>
          </View>
          <Pressable onPress={addDocument} style={styles.uploadButton}><Text style={styles.uploadText}>Add files</Text></Pressable>
        </View>
        {documents.map((name) => <Text key={name} style={styles.file}>✓ {name}</Text>)}

        <View style={styles.callout}>
          <Text style={styles.calloutTitle}>Next: 9 questions</Text>
          <Text style={styles.calloutText}>Our AI will use your submission and documents to create a personalized challenge. Each response gets 60 seconds.</Text>
        </View>

        <Pressable disabled={!canContinue} onPress={() => router.push('/assessment')} style={[styles.primary, !canContinue && styles.disabled]}>
          <Text style={styles.primaryText}>Start my evaluation</Text><Text style={styles.arrow}>→</Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
}

function Field({ label, value, onChangeText, placeholder, multiline = false }: { label: string; value: string; onChangeText: (s: string) => void; placeholder: string; multiline?: boolean }) {
  return <View style={styles.field}><Text style={styles.label}>{label}</Text><TextInput value={value} onChangeText={onChangeText} placeholder={placeholder} placeholderTextColor="#9A978F" multiline={multiline} textAlignVertical={multiline ? 'top' : 'center'} style={[styles.input, multiline && styles.textarea]} /></View>;
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  content: { padding: 24, paddingBottom: 36 },
  top: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 22 },
  kicker: { color: '#4F46E5', fontWeight: '800', fontSize: 12, letterSpacing: 1.5 },
  count: { color: '#8E8B84', fontWeight: '700', fontSize: 12, letterSpacing: 1.1 },
  title: { color: '#111111', fontSize: 31, lineHeight: 36, fontWeight: '800', letterSpacing: -0.8 },
  subtitle: { color: '#6C6962', fontSize: 15, lineHeight: 23, marginTop: 10, marginBottom: 28 },
  field: { marginBottom: 20 },
  label: { color: '#26251F', fontSize: 13, fontWeight: '800', marginBottom: 8 },
  input: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2DFD7', borderRadius: 16, paddingHorizontal: 15, minHeight: 52, color: '#171714', fontSize: 15 },
  textarea: { minHeight: 128, paddingTop: 14 },
  uploadCard: { backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E2DFD7', borderRadius: 18, padding: 16, flexDirection: 'row', gap: 12, alignItems: 'center' },
  cardTitle: { color: '#171714', fontSize: 14, fontWeight: '800' },
  cardText: { color: '#7B7871', fontSize: 12, lineHeight: 18, marginTop: 4 },
  uploadButton: { borderRadius: 12, borderWidth: 1, borderColor: '#D4D1C8', paddingHorizontal: 13, paddingVertical: 11 },
  uploadText: { color: '#27251F', fontSize: 12, fontWeight: '800' },
  file: { color: '#4F46E5', fontSize: 12, marginTop: 8, marginLeft: 4 },
  callout: { borderRadius: 18, backgroundColor: '#EEEDFF', padding: 17, marginTop: 22 },
  calloutTitle: { color: '#26215E', fontWeight: '800', fontSize: 14 },
  calloutText: { color: '#59547A', fontSize: 13, lineHeight: 19, marginTop: 6 },
  primary: { marginTop: 20, backgroundColor: '#4F46E5', borderRadius: 18, paddingVertical: 17, paddingHorizontal: 20, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  disabled: { opacity: 0.42 },
  primaryText: { color: '#FFFFFF', fontSize: 16, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 20, fontWeight: '700' },
});
