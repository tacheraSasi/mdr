import { ListItem, Picker } from '@expo/ui';

export type SettingPickerOption<T extends string> = {
  label: string;
  value: T;
};

type SettingPickerProps<T extends string> = {
  label: string;
  value: T;
  options: SettingPickerOption<T>[];
  onValueChange: (value: T) => void;
};

/**
 * Android uses a Material 3 list row with the picker in the trailing slot,
 * so the dropdown stays inside the row instead of stretching a text field.
 */
export function SettingPicker<T extends string>({
  label,
  value,
  options,
  onValueChange,
}: SettingPickerProps<T>) {
  return (
    <ListItem
      trailing={
        <Picker selectedValue={value} onValueChange={onValueChange} accessibilityLabel={label}>
          {options.map((option) => (
            <Picker.Item key={option.value} label={option.label} value={option.value} />
          ))}
        </Picker>
      }>
      {label}
    </ListItem>
  );
}
