import { Stack } from "expo-router";

export default function RootGroupLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      {/* Nest the tabs group inside the (root) group */}
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
    </Stack>
  );
}