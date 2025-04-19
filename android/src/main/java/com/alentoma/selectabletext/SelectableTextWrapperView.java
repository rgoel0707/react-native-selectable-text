package com.rob117.selectabletext;

import android.content.Context;
import android.widget.FrameLayout;

import com.facebook.react.views.text.ReactTextView;

public class SelectableTextWrapperView extends FrameLayout {
    private final ReactTextView textView;

    public SelectableTextWrapperView(Context context) {
        super(context);
        textView = new ReactTextView(context);

        textView.setFocusable(true);
        textView.setFocusableInTouchMode(true);
        textView.setTextIsSelectable(true);

        this.addView(textView, new LayoutParams(
                LayoutParams.MATCH_PARENT,
                LayoutParams.WRAP_CONTENT
        ));
    }

    public ReactTextView getTextView() {
        return textView;
    }
}
