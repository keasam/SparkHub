import { useState } from 'react';
import { router } from 'expo-router';
import { Shell, Field, Choice } from '../src/ui';
import { Text, View } from 'react-native';

export default function Profile() {
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('');
  const [bio, setBio] = useState('');

  return (
    <Shell
      step="STEP 02 · PERSONAL"
      title="Tell us about you."
      subtitle="Your background gives the evaluator context for the founder and execution dimensions."
      next={() => router.push('/education')}
    >
      <Field label="Full name" value={name} onChangeText={setName} placeholder="Your name" />
      <Field label="City / location" value={city} onChangeText={setCity} placeholder="City, state, country" />
      <View>
        <Field label="Age" value={age} onChangeText={setAge} placeholder="Age" keyboardType="number-pad" />
        <Text style={{ fontSize: 13, fontWeight: '800', marginBottom: 8, color: '#26251F' }}>Gender</Text>
        {['Prefer not to say', 'Female', 'Male', 'Non-binary'].map((x) => (
          <Choice key={x} label={x} selected={gender === x} onPress={() => setGender(x)} />
        ))}
      </View>
      <Field
        label="Short introduction"
        value={bio}
        onChangeText={setBio}
        placeholder="A little about you, your interests, and what drives you..."
        multiline
      />
    </Shell>
  );
}
