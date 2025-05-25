import React, { memo } from 'react';
import { TextInput, TextInputProps } from 'react-native';

interface CustomTextInputProps extends TextInputProps {}

const CustomTextInput: React.FC<CustomTextInputProps> = (props) => {
  const { style, ...rest } = props;

  return <TextInput {...rest} allowFontScaling={false} style={style} />;
};

export default memo(CustomTextInput);
