import { Switch } from '@expo/ui';

type SettingSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

/**
 * A native SwiftUI Toggle row. Tapping the switch or its label toggles it.
 */
export function SettingSwitch({ label, value, onValueChange }: SettingSwitchProps) {
  return <Switch label={label} value={value} onValueChange={onValueChange} />;
}
