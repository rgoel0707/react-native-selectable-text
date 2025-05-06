"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SelectableText = void 0;
var react_1 = __importDefault(require("react"));
var react_native_1 = require("react-native");
var fast_memoize_1 = __importDefault(require("fast-memoize"));
var RNSelectableText = (0, react_native_1.requireNativeComponent)('RNSelectableText');
var combineHighlights = (0, fast_memoize_1.default)(function (numbers) {
    return numbers
        .sort(function (a, b) { return a.start - b.start || a.end - b.end; })
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
var mapHighlightsRanges = function (value, highlights) {
    var combinedHighlights = combineHighlights(highlights);
    if (combinedHighlights.length === 0)
        return [{ isHighlight: false, text: value, id: undefined, color: undefined }];
    var data = [{ isHighlight: false, text: value.slice(0, combinedHighlights[0].start), id: combinedHighlights[0].id, color: combinedHighlights[0].color }];
    combinedHighlights.forEach(function (_a, idx) {
        var start = _a.start, end = _a.end, id = _a.id, color = _a.color;
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
    return data.filter(function (x) { return x.text; });
};
var SelectableText = function (_a) {
    var _b;
    var onSelection = _a.onSelection, onHighlightPress = _a.onHighlightPress, textValueProp = _a.textValueProp, value = _a.value, TextComponent = _a.TextComponent, textComponentProps = _a.textComponentProps, prependToChild = _a.prependToChild, props = __rest(_a, ["onSelection", "onHighlightPress", "textValueProp", "value", "TextComponent", "textComponentProps", "prependToChild"]);
    var TX = (TextComponent = TextComponent || react_native_1.Text);
    textValueProp = textValueProp || 'children';
    var onSelectionNative = function (event) {
        var nativeEvent = event.nativeEvent;
        onSelection && onSelection(nativeEvent);
    };
    var onHighlightPressNative = onHighlightPress
        ? react_native_1.Platform.OS === 'ios'
            ? function (event) {
                if (!props.highlights || props.highlights.length === 0)
                    return;
                var mergedHighlights = combineHighlights(props.highlights);
                var hightlightInRange = mergedHighlights.find(function (_a) {
                    var start = _a.start, end = _a.end;
                    return event.nativeEvent.clickedRangeStart >= start - 1 && event.nativeEvent.clickedRangeEnd <= end + 1;
                });
                if (hightlightInRange) {
                    onHighlightPress(hightlightInRange.id);
                }
            }
            : onHighlightPress
        : function () { };
    var textValue = value;
    if (TextComponent == react_native_1.Text) {
        textValue = (props.highlights && props.highlights.length > 0
            ? mapHighlightsRanges(value, props.highlights).map(function (_a) {
                var id = _a.id, isHighlight = _a.isHighlight, text = _a.text, color = _a.color;
                return (<react_native_1.Text key={(new Date()).getTime()} {...textComponentProps} selectable={true} style={isHighlight ? { backgroundColor: color !== null && color !== void 0 ? color : props.highlightColor } : {}} onPress={function (event) {
                        if (textComponentProps && textComponentProps.onPress)
                            textComponentProps.onPress(event);
                        if (isHighlight) {
                            onHighlightPress && onHighlightPress(id !== null && id !== void 0 ? id : "");
                        }
                    }}>
            {text} </react_native_1.Text>);
            })
            : [value]);
        if (props.appendToChildren) {
            textValue.push(props.appendToChildren);
        }
        if (prependToChild)
            textValue = __spreadArray([prependToChild], textValue, true);
    }
    return (<RNSelectableText {...props} onHighlightPress={onHighlightPressNative} selectable={true} onSelection={onSelectionNative}>
      <TX key={(new Date()).getTime()} {...__assign((_b = {}, _b[textValueProp] = textValue, _b), textComponentProps)}/>
    </RNSelectableText>);
};
exports.SelectableText = SelectableText;
