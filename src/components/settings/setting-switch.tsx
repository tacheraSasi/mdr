import { Switch } from '@expo/ui';

type SettingSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

export function SettingSwitch({ label, value, onValueChange }: SettingSwitchProps) {
  return <Switch label={label} value={value} onValueChange={onValueChange} />;
}
