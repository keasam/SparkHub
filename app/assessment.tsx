import { router } from 'expo-router';
import { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const questions = [
  'What specific customer pain makes this idea worth paying for today?',
  'What evidence do you have that your target customer will actually adopt this solution?',
  'Which existing alternative would your customer use instead, and why would they switch?',
  'What is the strongest assumption in your business model right now?',
  'Why is your proposed solution meaningfully different from what already exists?',
  'How will you acquire your first 10 customers without relying on broad advertising?',
  'What part of your plan is hardest to execute with your current team or resources?',
  'What would make this market much smaller than you currently expect?',
  'What is the single experiment you would run next to prove or disprove your idea?',
];

const mockScores = [84, 76, 71, 79, 73, 81, 68, 74, 86];

export default function Assessment() {
  const [index, setIndex] = useState(0);
  const [seconds, setSeconds] = useState(60);
  const [answer, setAnswer] = useState('');
  const [paused, setPaused] = useState(false);
  const [submitted, setSubmitted] = useState<number[]>([]);
  const interval = useRef<ReturnType<typeof setInterval> | null>(null);

  const progress = useMemo(() => `${index + 1} / ${questions.length}`, [index]);

  useEffect(() => {
    if (paused) return;
    interval.current = setInterval(() => {
      setSeconds((value) => {
        if (value <= 1) return 60;
        return value - 1;
      });
    }, 1000);
    return () => { if (interval.current) clearInterval(interval.current); };
  }, [paused, index]);

  function submit() {
    setSubmitted((items) => [...items, mockScores[index]]);
    if (index === questions.length - 1) {
      router.replace('/result');
      return;
    }
    setIndex((value) => value + 1);
    setSeconds(60);
    setAnswer('');
    setPaused(false);
  }

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.container}>
        <View style={styles.header}>
          <View><Text style={styles.kicker}>IDEA CHALLENGE</Text><Text style={styles.progress}>{progress}</Text></View>
          <Pressable style={styles.pause} onPress={() => setPaused((value) => !value)}><Text style={styles.pauseText}>{paused ? 'Resume' : 'Pause'}</Text></Pressable>
        </View>

        <View style={styles.timerWrap}>
          <Text style={styles.timer}>{String(seconds).padStart(2, '0')}</Text>
          <Text style={styles.timerLabel}>SECONDS</Text>
        </View>

        {paused ? (
          <View style={styles.pausedCard}><Text style={styles.pausedTitle}>Assessment paused</Text><Text style={styles.pausedText}>Your current answer is still here. Resume when you’re ready.</Text><Pressable onPress={() => setPaused(false)} style={styles.primary}><Text style={styles.primaryText}>Resume challenge</Text></Pressable></View>
        ) : (
          <>
            <Text style={styles.question}>{questions[index]}</Text>
            <Text style={styles.helper}>Answer from your own experience. There is no perfect answer.</Text>
            <TextInput value={answer} onChangeText={setAnswer} multiline maxLength={1000} placeholder="Write your response..." placeholderTextColor="#98958D" style={styles.input} textAlignVertical="top" />
            <View style={styles.bottom}><Text style={styles.counter}>{answer.length}/1000</Text><Pressable onPress={submit} disabled={!answer.trim()} style={[styles.primary, !answer.trim() && styles.disabled]}><Text style={styles.primaryText}>{index === 8 ? 'Finish evaluation' : 'Submit answer'}</Text><Text style={styles.arrow}>→</Text></Pressable></View>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8F7F2' },
  container: { flex: 1, padding: 24 },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  kicker: { color: '#4F46E5', fontSize: 11, fontWeight: '800', letterSpacing: 1.6 },
  progress: { color: '#6C6962', fontSize: 14, fontWeight: '700', marginTop: 3 },
  pause: { borderWidth: 1, borderColor: '#DDD9D0', borderRadius: 12, paddingHorizontal: 13, paddingVertical: 9 },
  pauseText: { color: '#4A4842', fontSize: 12, fontWeight: '800' },
  timerWrap: { alignSelf: 'center', alignItems: 'center', marginVertical: 32 },
  timer: { color: '#111111', fontSize: 50, lineHeight: 55, fontWeight: '800', letterSpacing: -1 },
  timerLabel: { color: '#8A877F', fontSize: 10, fontWeight: '800', letterSpacing: 1.4, marginTop: 2 },
  question: { color: '#171714', fontSize: 27, lineHeight: 33, fontWeight: '800', letterSpacing: -0.5 },
  helper: { color: '#737069', fontSize: 13, lineHeight: 19, marginTop: 10, marginBottom: 18 },
  input: { flex: 1, minHeight: 180, maxHeight: 300, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: '#E0DDD5', borderRadius: 18, padding: 16, color: '#171714', fontSize: 15, lineHeight: 22 },
  bottom: { marginTop: 12 },
  counter: { color: '#9B988F', fontSize: 11, textAlign: 'right', marginBottom: 8 },
  primary: { backgroundColor: '#4F46E5', borderRadius: 17, paddingVertical: 16, paddingHorizontal: 18, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  disabled: { opacity: 0.4 },
  primaryText: { color: '#FFFFFF', fontSize: 15, fontWeight: '800' },
  arrow: { color: '#FFFFFF', fontSize: 19, fontWeight: '700' },
  pausedCard: { marginTop: 40, backgroundColor: '#FFFFFF', borderRadius: 22, borderWidth: 1, borderColor: '#E2DFD7', padding: 20 },
  pausedTitle: { color: '#171714', fontSize: 21, fontWeight: '800' },
  pausedText: { color: '#6F6C65', fontSize: 14, lineHeight: 20, marginTop: 8, marginBottom: 18 },
});
