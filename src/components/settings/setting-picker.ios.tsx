import { Picker, Row, Spacer, Text } from '@expo/ui';

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
 * iOS keeps the picker in a normal Form row with its label on the leading
 * edge, matching the Settings-style menu picker.
 */
export function SettingPicker<T extends string>({
  label,
  value,
  options,
  onValueChange,
}: SettingPickerProps<T>) {
  return (
    <Row spacing={12}>
      <Text>{label}</Text>
      <Spacer flexible />
      <Picker selectedValue={value} onValueChange={onValueChange} accessibilityLabel={label}>
        {options.map((option) => (
          <Picker.Item key={option.value} label={option.label} value={option.value} />
        ))}
      </Picker>
    </Row>
  );
}
