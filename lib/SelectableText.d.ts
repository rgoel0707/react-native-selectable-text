import React, { ReactNode } from 'react';
import { TextStyle, StyleProp, TextProps, TextInputProps } from 'react-native';
type ColorValue = string;
export interface IHighlights {
    start: number;
    end: number;
    id: string;
    color?: ColorValue;
}
export interface NativeEvent {
    content: string;
    eventType: string;
    selectionStart: number;
    selectionEnd: number;
}
export interface SelectableTextProps {
    value: string;
    onSelection: (args: {
        eventType: string;
        content: string;
        selectionStart: number;
        selectionEnd: number;
    }) => void;
    prependToChild: ReactNode;
    menuItems: string[];
    highlights?: Array<IHighlights>;
    highlightColor?: ColorValue;
    style?: StyleProp<TextStyle>;
    onHighlightPress?: (id: string) => void;
    appendToChildren?: ReactNode;
    TextComponent?: React.ComponentType<any>;
    textValueProp?: string;
    textComponentProps?: TextProps | TextInputProps;
}
export declare const SelectableText: ({ onSelection, onHighlightPress, textValueProp, value, TextComponent, textComponentProps, prependToChild, ...props }: SelectableTextProps) => React.JSX.Element;
export {};
