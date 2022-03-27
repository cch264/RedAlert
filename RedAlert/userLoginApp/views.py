from django.shortcuts import render

# Create your views here.


from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate, login
from django.core.mail import send_mail
from django.views import View
from django.db.models import Q
from redAlertSite.models import Client
from .models import UserInfo
import random
from django.utils.dateparse import parse_date
from .forms import UserSignUpForm
from sms import send_sms
from django.contrib.auth import logout


# Create your views here.
# A view function is the code we run before showing a user a page so we can query the database and perform other functions
# like user authentication or creating a list of data to show on the web page.
# If login_success =3 , user did not just log in. 0 if user failed to log in and 1 if they succeeded in logging in.
def userLoginPage( request, pass_change="false", loginSuccess=1, loggedOut = 0, newAccountSuccess = 0 ):

    print("request params {}".format(request.GET))
    print("PASS CHANGE IS {}".format(pass_change))
    user_changed_password = False

    not_logged_in_message = ""
    not_logged_in = False

    if pass_change != "false":
        user_changed_password = True

    if loggedOut == 1:
        logout(request) # log the user out from the system.

    # WE receive a get param when the user trys to access a page they dont have permissions to access. Check for it using a try block so we dont crash nothing.
    try:
        if request.GET['next']:
            not_logged_in = True
            not_logged_in_message = "You must be logged in to access that page!"
    except:
        print('User was logged in.')


    
    response = { 'changed_pass': user_changed_password, 'loginSuccess': loginSuccess, 'loggedOut':loggedOut, 'not_logged_in': not_logged_in, 'not_logged_in_message': not_logged_in_message, 'created_new_account': newAccountSuccess}

    return render(request, 'userLoginApp/userLogin.html', response)


# Not done yet.
def authenticateUserLogin( request ):

    user = authenticate(username= request.POST['user-name'], password=request.POST['user-pass'])

    # If user is already logged in, redirect them to the dashboard!
    # request.user.is_authenticated
    if user is not None:
        print("MADE IT HERE")

        # This saves the users information into the Django session object. This will be used to verify a user is logged in before showing them a page.
        login(request, user)
        # A backend authenticated the credentials
        # Redirect user to the dashboard.html template. We only provide a relative path because RedAlert/urls.py file will take over the routing from here.
        return HttpResponseRedirect('/dashboard')
    else:
        # No backend authenticated the credentials, redirect user back to login page.
        return HttpResponseRedirect(reverse('loginAppUrls:user_login_page', args=(0,)) )


def createNewUserForm( request ):
    print("IN CREATE NEW USER FORM")

    # if this is a POST request we need to process the form data
    if request.method == 'POST':
        # create a form instance and populate it with data from the request:
        # This is called binding the form.
        userSignUpForm = UserSignUpForm(request.POST)

        # check whether it's valid:
        # PROLLY NOT VALID TBH
        if userSignUpForm.is_valid():
        # process the data in form.cleaned_data as required

            # Get the cleaned data dictionary from the form.
            cd = userSignUpForm.cleaned_data
            # username, email, password is the order of args that create_user takes.
            # Create user using Djangos built in user authentication which encrypts user passwords in the db.
            # Username has to be unique so for now we will use email as username since that must be unique for a user to make an account.
            new_user = User.objects.create_user( cd['email'] , cd['email'], cd['password'] )

            # Set the first and last name fields of the new_user object
            new_user.first_name = cd['first_name']
            new_user.last_name = cd['last_name']

            new_user.save()

            # Create a user info object to store the agents info. new_use is a object that comes from the User model provided by django.
            # It has limited fields, only email pass, username, so we store extra info in this model for each agent.
            # There is a custom User model users can implement but this seemed easier.
            new_user_info = UserInfo()
            new_user_info.first_name = cd['first_name']
            new_user_info.last_name = cd['last_name']
            new_user_info.email = cd['email']


            # When user enters birthday in the form, it must look exactly like this YYYY-MM-DD for it to be valid.
            # The python form handles turning the string into a python datetime.date object.
            new_user_info.birthdate = cd['birthday']


            new_user_info.agency_name = cd['agency_name']
            new_user_info.agent_code = cd['agent_code']
            new_user_info.agent_phone_number = cd['agent_phone_number']
            new_user_info.agent_address = cd['agent_address']
            new_user_info.user_id = new_user.id
            

            # Save the user to the db.
            new_user_info.save()

            print("REDIRECTING TO NEW URL")

            # redirect to a new URL:
            return HttpResponseRedirect(reverse('loginAppUrls:new_user_account_success', args=(1,) ) )
            #HttpResponseRedirect(reverse('loginAppUrls:new_user_success'))

        else:
            # Get the cleaned data dictionary from the form.
            cd = userSignUpForm.cleaned_data
            print("Failed to validate, The cleaned data is: {}".format(cd) )

            # This part is IMPORTANT. If the data failed to completely validate, then redirect the user to the same page
            # and pass the form object back to the template. The form now has already been bound with data, so after
            # the page loads the form will still be filled with data and will prompt the user to fix the errors in the form.
            return render(request, 'userLoginApp/createNewUser.html', {'signUpForm': userSignUpForm})
            


    # if a GET (or any other method) we'll create a blank form
    else:
        userSignUpForm = UserSignUpForm()

        # Pass the form object to the view with the name signUpForm.
        return render(request, 'userLoginApp/createNewUser.html', {'signUpForm': userSignUpForm})
        

def loginSuccess( request ):
    return render(request, 'userLoginApp/userLoginSuccess.html')


# Need to check and make sure email is not already in use before saving new user.
def saveNewUser( request ):


    return HttpResponseRedirect(reverse('loginAppUrls:user_login_page'))


def newUserSuccess( request ):
    return render(request, 'userLoginApp/newUserSuccess.html')
