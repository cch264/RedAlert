from django.shortcuts import render

# Create your views here.


from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.views import View
from django.db.models import Q
from redAlertSite.models import Client
from .models import UserInfo
import random
from django.utils.dateparse import parse_date


# Create your views here.
# A view function is the code we run before showing a user a page so we can query the database and perform other functions
# like user authentication or creating a list of data to show on the web page.
# If login_success =3 , user did not just log in. 0 if user failed to log in and 1 if they succeeded in logging in.
def userLoginPage( request ):

    return render(request, 'userLoginApp/userLogin.html')


# Not done yet.
def authenticateUserLogin( request ):
    
    user = authenticate(username= request.POST['user-name'], password=request.POST['user-pass'])

    if user is not None:
        print("MADE IT HERE")
        # A backend authenticated the credentials
        return HttpResponseRedirect(reverse('loginAppUrls:login_success'))
    else:
        # No backend authenticated the credentials
        return HttpResponseRedirect(reverse('red_alert_site:landing_page', args=(0,)))


def createNewUserForm( request ):
    return render(request, 'userLoginApp/createNewUser.html')

def loginSuccess( request ):
    return render(request, 'userLoginApp/userLoginSuccess.html')


def saveNewUser( request ):
    # username, email, password,
    # Create user using Djangos built in user authentication which encrypts user passwords in the db.
    new_user = User.objects.create_user( "none", request.POST['new-user-email'], request.POST['new-user-pass'] )

    # Set the first and last name fields of the new_user object
    new_user.first_name = request.POST['new-user-first-name']
    new_user.last_name = request.POST['new-user-last-name']

    new_user.save()
    
    # Create a user info object to store the agents info. new_use is a object that comes from the User model provided by django.
    # It has limited fields, only email pass, username, so we store extra info in this model for each agent.
    # There is a custom User model users can implement but this seemed easier.
    new_user_info = UserInfo()
    new_user_info.first_name = request.POST['new-user-first-name']
    new_user_info.last_name = request.POST['new-user-last-name']
    new_user_info.email = request.POST['new-user-email']

    # Returns a date object YYYY-MM-DD
    user_birthday = parse_date(request.POST['new-user-birthday'])
    new_user_info.birthdate = user_birthday


    new_user_info.agency_name = request.POST['new-user-agency']
    new_user_info.agent_code = request.POST['new-user-agent-code']
    new_user_info.agent_phone_number = request.POST['new-user-agent-phone']
    new_user_info.agent_address = request.POST['new-user-address']
    new_user_info.user_id = new_user.id


    return HttpResponseRedirect(reverse('loginAppUrls:new_user_success'))


def newUserSuccess( request ):
    return render(request, 'userLoginApp/newUserSuccess.html')
