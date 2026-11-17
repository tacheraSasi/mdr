import { ListItem, Switch } from '@expo/ui';

type SettingSwitchProps = {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
};

/**
 * The universal labeled Switch puts `toggleable` on the whole row and leaves
 * the inner Compose Switch without a change handler, so tapping the switch
 * itself is swallowed. A Material 3 list row with an unlabeled trailing
 * switch keeps the control's own hit target working.
 */
export function SettingSwitch({ label, value, onValueChange }: SettingSwitchProps) {
  return (
    <ListItem trailing={<Switch value={value} onValueChange={onValueChange} />}>
      {label}
    </ListItem>
  );
}
