declare module 'react-native-ios-kit' {
  import { Component } from 'react';
  import { StyleProp, TextStyle, ViewStyle } from 'react-native';

  export interface ButtonProps {
    onPress?: () => void;
    inline?: boolean;
    rounded?: boolean;
    color?: string;
    style?: StyleProp<ViewStyle>;
    textStyle?: StyleProp<TextStyle>;
    children?: React.ReactNode;
  }

  export class Button extends Component<ButtonProps> {}
}

