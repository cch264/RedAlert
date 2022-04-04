from cProfile import label
from django import forms
from django.core.exceptions import ValidationError
from django.core.validators import MaxLengthValidator


'''
Important Notes about fields in forms
    AutoID: if auto_id is set to True, then the form output will include <label> tags and will use the field name as its id for each form field:f = ContactForm(auto_id=True)
'''

# ADD required=False to make field optional.
class UserSignUpForm(forms.Form):

    first_name = forms.CharField(label='First Name', max_length=100 )
    first_name.widget.attrs['required'] = 'true'

    last_name = forms.CharField( label='Last Name', max_length=100 )
    last_name.widget.attrs['required'] = 'true'

    email = forms.CharField( max_length=100 )

    # Assign an html attribute to the field.
    email.widget.attrs['autocomplete'] = 'off'
    email.widget.attrs['required'] = 'true'

    # forms.CharField specifies the type of input field, widgets are
    # kind of like addons. forms.CharField is called a form field,
    # PasswordInput is a form widget.
    # If label is not provided, the label defaults to the name of the form field.
    password = forms.CharField( widget=forms.PasswordInput )
    password.widget.attrs['required'] = 'true'

    password_confirm = forms.CharField(label='Confirm Password', widget=forms.PasswordInput )
    password_confirm.widget.attrs['required'] = 'true'

    # Format of date returned (YYYY-MM-DD)
    birthday = forms.DateField( label='Birthday', widget=forms.DateInput( attrs={'class':'test-class', 'type':'date'} ) )
    birthday.widget.attrs['required'] = 'true'

    agency_name = forms.CharField( label='Agency Name', max_length=100 )
    agency_name.widget.attrs['required'] = 'true'

    agent_code = forms.CharField( label='Agent Code', max_length=100 )
    agent_code.widget.attrs['required'] = 'true'

    agent_phone_number = forms.CharField( label='Phone Number')
    agent_phone_number.widget.attrs['required'] = 'true'

    agent_address = forms.CharField( label='Your Address')
    agent_address.widget.attrs['required'] = 'true'

    # Used to clean an individual form! clean_fieldname must be the method name  for this to work.
    # This is a custom method that is called automatically when the forms is being validated and cleaned to ensure the proper data has been entered.
    # Here we will enforce password complexity.
    def clean_password_confirm( self ):
        password1 = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password_confirm")

        # Empty strings are false ie ''. Non empty strings are always true ie 'hello'
        # So if both strings are non empty, then execute the if block.
        if password1 and password2:

            # Only do something if both fields are valid so far.
            if password1 != password2:
                print('Passes dont match')
                raise ValidationError(
                    "Both Passwords Must Match!"
                )
        # If one of the fields is empty
        else:
            print('One field empty')

            raise ValidationError(
                "Both Password Fields Must Be Filled Out!"
            )






'''
# Used to clean an individual form! clean_fieldname must be the method name  for this to work.
def clean_password( self ):
        password1 = self.cleaned_data.get("password")
        password2 = self.cleaned_data.get("password_confirm")

        # Empty strings are false ie ''. Non empty strings are always true ie 'hello'
        # So if both strings are non empty, then execute the if block.
        if password1 and password2:

            # Only do something if both fields are valid so far.
            if password1 != password2:
                print('Passes dont match')
                raise ValidationError(
                    "Both Passwords Must Match!"
                )
        # If one of the fields is empty
        else:
            print('One field empty')

            raise ValidationError(
                "Both Password Fields Must Be Filled Out!"
            )
'''





'''
def clean(self):
        cleaned_data = super().clean()
        password1 = cleaned_data.get("password")
        password2 = cleaned_data.get("password_confirm")

        # Empty strings are false ie ''. Non empty strings are always true ie 'hello'
        # So if both strings are non empty, then execute the if block.
        if password1 and password2:
            # Only do something if both fields are valid so far.
            if password1 != password2:
                print('Passes dont match')
                self.add_error('password', "Please repeat your password.")
                self.add_error('password_confirm', "Please repeat your password.")
        # If one of the fields is empty
        else:
            print('One field empty')

            self.add_error('password', "Please repeat your password.")
            self.add_error('password_confirm', "Please repeat your password.")
'''


'''
    # This is a custom method that is called automatically when the forms is being validated and cleaned to ensure the proper data has been entered.
    # Here we will enforce password complexity.
    # A Custom clean method raises a visible error in place of the {{signUpForm.non_field_errors}} block that goes inside your form.
    # With this tag you decide where clean() errors
    # Are placed in the page.
    def clean(self):
    cleaned_data = super().clean()
    password1 = cleaned_data.get("password")
    password2 = cleaned_data.get("password_confirm")

    # Empty strings are false ie ''. Non empty strings are always true ie 'hello'
    # So if both strings are non empty, then execute the if block.
    if password1 and password2:
    # Only do something if both fields are valid so far.
    if password1 != password2:
    print('Passes dont match')
    raise ValidationError(
        "Both Passwords Must Match!"
    )
    # If one of the fields is empty
    else:
    print('One field empty')

    raise ValidationError(
    "Both Password Fields Must Be Filled Out!"
    )
'''
