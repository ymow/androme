## chrome-mobile-layouts

The program can convert moderately complex HTML pages into XML layouts for Android. iOS and Xamarin layouts are also to be included at some point with the Chrome browser plugin. XML structure can be imported into your Android projects although the attributes are nowhere close to be ready for production. Some modification is necessary to use it your webpage.

<img src="sample.png" alt="Chrome Mobile Layouts Plugin" />

```xml
<?xml version="1.0" encoding="utf-8"?>
<LinearLayout>
	<TextView
		android:text="@string/Entry"
		android:fontFamily="Arial, Helvetica, Tahoma"
		android:textSize="14px"
		android:textStyle="normal"
		android:textColor="#FFFFFF"
		android:letterSpacing="0.3" />
	<LinearLayout>
		<GridLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:columnCount="2">
			<TextView
				android:text="@string/Order:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<EditText
				android:fontFamily="Arial"
				android:textSize="13.3333px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Date (Add):"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
			</RelativeLayout>
			<TextView
				android:text="@string/Time:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
			</RelativeLayout>
			<TextView
				android:text="@string/Type:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Topic (Add):"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<EditText
					android:fontFamily="Arial"
					android:textSize="13.3333px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
			</RelativeLayout>
			<TextView
				android:text="@string/Series:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Subset:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Active:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
		</GridLayout>
		<Button
			android:text="@string/Add" />
	</LinearLayout>
	<LinearLayout>
		<GridLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:columnCount="2">
			<TextView
				android:text="@string/Series:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Subset:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Entries:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Button
					android:text="@string/Open" />
				<Button
					android:text="@string/All" />
			</RelativeLayout>
			<TextView
				android:text="@string/Mode:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Style:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Calendar:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<Spinner
				android:fontFamily="Arial"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="normal" />
			<TextView
				android:text="@string/Version:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Button
					android:text="@string/Update" />
			</RelativeLayout>
			<TextView
				android:text="@string/Branch:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Button
					android:text="@string/Update" />
				<Button
					android:text="@string/Clone" />
			</RelativeLayout>
			<TextView
				android:text="@string/Custom (Add):"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<EditText
					android:fontFamily="Arial"
					android:textSize="13.3333px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<EditText
					android:fontFamily="Arial"
					android:textSize="13.3333px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
			</RelativeLayout>
			<TextView
				android:text="@string/Conclusion:"
				android:fontFamily="Arial, Helvetica, Tahoma"
				android:textSize="12px"
				android:textStyle="normal"
				android:textColor="#000000"
				android:letterSpacing="0.3" />
			<RelativeLayout>
				<Spinner
					android:fontFamily="Arial"
					android:textSize="12px"
					android:textStyle="normal"
					android:textColor="#000000"
					android:letterSpacing="normal" />
				<RelativeLayout>
					<RadioButton
						android:id="@+id/c2"
						android:fontFamily="Arial"
						android:text="@string/Birth"
						android:textStyle="normal"
						android:textColor="#000000"
						android:letterSpacing="0.3" />
					<RadioButton
						android:id="@+id/c3"
						android:fontFamily="Arial"
						android:text="@string/Death"
						android:textStyle="normal"
						android:textColor="#000000"
						android:letterSpacing="0.3" />
					<CheckBox
						android:id="@+id/c4"
						android:fontFamily="Arial"
						android:text="@string/None"
						android:textStyle="normal"
						android:textColor="#000000"
						android:letterSpacing="0.3" />
				</RelativeLayout>
				<Button
					android:text="@string/Update" />
			</RelativeLayout>
		</GridLayout>
		<Button
			android:text="@string/Next" />
	</LinearLayout>
</LinearLayout>
```