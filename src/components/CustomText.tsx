import React, { memo } from 'react';
import { Text, TextProps } from 'react-native';

interface CustomTextProps extends TextProps {
  children: React.ReactNode;
}

const CustomText: React.FC<CustomTextProps> = (props) => {
  const { style, children, ...rest } = props;

  return (
    <Text {...rest} allowFontScaling={false} style={style}>
      {children}
    </Text>
  );
};

export default memo(CustomText);
