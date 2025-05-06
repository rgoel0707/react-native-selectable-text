"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectableText = void 0;
const react_1 = __importDefault(require("react"));
const react_native_1 = require("react-native");
const fast_memoize_1 = __importDefault(require("fast-memoize"));
const RNSelectableText = (0, react_native_1.requireNativeComponent)('RNSelectableText');
const combineHighlights = (0, fast_memoize_1.default)((numbers) => {
    return numbers
        .sort((a, b) => a.start - b.start || a.end - b.end)
        .reduce(function (combined, next) {
        if (!combined.length || combined[combined.length - 1].end < next.start)
            combined.push(next);
        else {
            var prev = combined.pop();
            if (prev)
                combined.push({
                    start: prev.start,
                    end: Math.max(prev.end, next.end),
                    id: next.id,
                    color: prev.color
                });
        }
        return combined;
    }, []);
});
const mapHighlightsRanges = (value, highlights) => {
    const combinedHighlights = combineHighlights(highlights);
    if (combinedHighlights.length === 0)
        return [{ isHighlight: false, text: value, id: undefined, color: undefined }];
    const data = [{ isHighlight: false, text: value.slice(0, combinedHighlights[0].start), id: combinedHighlights[0].id, color: combinedHighlights[0].color }];
    combinedHighlights.forEach(({ start, end, id, color }, idx) => {
        data.push({
            isHighlight: true,
            text: value.slice(start, end),
            id: id,
            color: color
        });
        if (combinedHighlights[idx + 1]) {
            data.push({
                isHighlight: false,
                text: value.slice(end, combinedHighlights[idx + 1].start),
                id: combinedHighlights[idx + 1].id,
                color: combinedHighlights[idx + 1].color
            });
        }
    });
    data.push({
        isHighlight: false,
        text: value.slice(combinedHighlights[combinedHighlights.length - 1].end, value.length),
        id: combinedHighlights[combinedHighlights.length - 1].id,
        color: combinedHighlights[combinedHighlights.length - 1].color
    });
    return data.filter(x => x.text);
};
const SelectableText = (_a) => {
    var { onSelection, onHighlightPress, textValueProp, value, TextComponent, textComponentProps, prependToChild } = _a, props = __rest(_a, ["onSelection", "onHighlightPress", "textValueProp", "value", "TextComponent", "textComponentProps", "prependToChild"]);
    const TX = TextComponent || react_native_1.Text;
    textValueProp = textValueProp || 'children';
    const onSelectionNative = (event) => {
        var nativeEvent = event.nativeEvent;
        onSelection && onSelection(nativeEvent);
    };
    const onHighlightPressNative = onHighlightPress
        ? react_native_1.Platform.OS === 'ios'
            ? (event) => {
                if (!props.highlights || props.highlights.length === 0)
                    return;
                const mergedHighlights = combineHighlights(props.highlights);
                const hightlightInRange = mergedHighlights.find((highlight) => event.nativeEvent.clickedRangeStart >= highlight.start - 1 && event.nativeEvent.clickedRangeEnd <= highlight.end + 1);
                if (hightlightInRange) {
                    onHighlightPress(hightlightInRange.id);
                }
            }
            : onHighlightPress
        : () => { };
    let textValue = value;
    if (TX === react_native_1.Text) {
        textValue = (props.highlights && props.highlights.length > 0
            ? mapHighlightsRanges(value, props.highlights).map(({ id, isHighlight, text, color }) => (<react_native_1.Text key={(new Date()).getTime()} {...textComponentProps} selectable={true} style={isHighlight ? { backgroundColor: color !== null && color !== void 0 ? color : props.highlightColor } : {}} onPress={(event) => {
                    if (textComponentProps && 'onPress' in textComponentProps && textComponentProps.onPress)
                        textComponentProps.onPress(event);
                    if (isHighlight) {
                        onHighlightPress && onHighlightPress(id !== null && id !== void 0 ? id : "");
                    }
                }}>
            {text}
          </react_native_1.Text>))
            : [value]);
        if (props.appendToChildren) {
            textValue.push(props.appendToChildren);
        }
        if (prependToChild)
            textValue = [prependToChild, ...textValue];
    }
    return (<RNSelectableText {...props} onHighlightPress={onHighlightPressNative} selectable={true} onSelection={onSelectionNative}>
      <TX key={(new Date()).getTime()} {...Object.assign({ [textValueProp]: textValue }, textComponentProps)}/>
    </RNSelectableText>);
};
exports.SelectableText = SelectableText;
