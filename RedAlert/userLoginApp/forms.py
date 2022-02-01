from cProfile import label
import attr
from django import forms
from django.core.validators import MaxLengthValidator


# ADD required=False to make field optional.
class UserSignUpForm(forms.Form):
    first_name = forms.CharField(label='First Name', max_length=100 )

    last_name = forms.CharField( label='Last Name', max_length=100 )

    email = forms.CharField( max_length=100 )

    # forms.CharField specifies the type of input field, widgets are 
    # kind of like addons. forms.CharField is called a form field,
    # PasswordInput is a form widget.
    # If label is not provided, the label defaults to the name of the form field.
    password = forms.CharField( widget=forms.PasswordInput )

    birthday = forms.DateField( label='Birthday (YYYY-MM-DD)', widget=forms.SelectDateWidget( attrs={'class':'test-class'} ) )

    agency_name = forms.CharField( label='Agency Name', max_length=100 )

    agent_code = forms.CharField( label='Agent Code', max_length=100 )

    agent_phone_number = forms.IntegerField( label='Phone Number')

    agent_address = forms.CharField( label='Your Address')

