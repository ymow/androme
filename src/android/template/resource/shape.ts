const template = [
'!0',
'<?xml version="1.0" encoding="utf-8"?>',
'<shape xmlns:android="http://schemas.android.com/apk/res/android" android:shape="rectangle">',
'!1',
'	<stroke android:width="{&width}" {borderStyle} />',
'!1',
'!2',
'	<solid android:color="@color/{&color}" />',
'!2',
'!3',
'	<corners android:radius="{&radius}" android:topLeftRadius="{@topLeftRadius}" android:topRightRadius="{@topRightRadius}" android:bottomLeftRadius="{@bottomLeftRadius}" android:bottomRightRadius="{@bottomRightRadius}" />',
'!3',
'!4',
'	<gradient android:type="{&type}" android:startColor="@color/{&startColor}" android:centerColor="@color/{@centerColor}" android:endColor="@color/{&endColor}" android:angle="{@angle}" android:centerX="{@centerX}" android:centerY="{@centerY}" android:gradientRadius="{@gradientRadius}" android:useLevel="{@useLevel}" />',
'!4',
'</shape>',
'!0'
];

export default template.join('\n');