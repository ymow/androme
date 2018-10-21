const template = [
'!0',
'<?xml version="1.0" encoding="utf-8"?>',
'<font-family {namespace}>',
'!1',
'	<font android:fontStyle="{style}" android:fontWeight="{weight}" android:font="{font}" />',
'!1',
'</font-family>',
'<!-- filename: res/font/{name}.xml -->',
'!0'
];

export default template.join('\n');