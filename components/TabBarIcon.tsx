import { Image } from 'react-native';

interface TabBarIconProps {
  icon: any;
  color: string;
}

export default function TabBarIcon({ icon, color }: TabBarIconProps) {
  return <Image source={icon} style={{ tintColor: color }} />;
}
