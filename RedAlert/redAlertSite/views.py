from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from django.core.mail import send_mail
from django.views import View
from django.db.models import Q
from .models import Client
#from sms import send_sms
import random


# Create your views here.
# A view function is the code we run before showing a user a page so we can query the database and perform other functions
# like user authentication or creating a list of data to show on the web page.
# If login_success =3 , user did not just log in. 0 if user failed to log in and 1 if they succeeded in logging in.
def landing_page( request, login_success=3 ):

    # Users are stored in the auth_user table!!!
    # User class is something built into Djanog, so you will not see a User object in the models.py file.
    #new_user = User.objects.create_user( 'Bobbyyyyy', "bobbyyy@email.com", '12345' )

    user_list = User.objects.all()

    context = {
               'user_list': user_list,
               'login_success': login_success,
    }
    # More concise way of rendering a template. Takes a request object, template name as second arg,
    # and dictionary as its third arg.
    # The context is a dictionary, stores python vars in a dictionary to be used by the template.
    return render(request, 'redAlertSite/index.html', context)

    # Requires importing loader and HttpResponse.
    # The context is a dictionary, stores python vars in a dictionary to be used by the template.
    #return HttpResponse(template.render(context, request))

# Show the create new user webpage
def create_new_user( request ):
    return render(request, 'redAlertSite/create_new_user.html')


def save_new_user( request ):
    # request.POST is a dictionary-like object that lets you access submitted data
    # by key names which are created based on the names of inputs in your form. For example,
    # request.POST['new-user-name'] is going to return the name the user entered because the
    #input where the user entered their name had the attribute name="new-user-name"

    new_user = User.objects.create_user( request.POST['new-user-name'], "defaultemail@email.com", request.POST['new-user-pass']  )

    new_user.save()

    return HttpResponseRedirect( reverse('red_alert_site:landing_page') )

def send_email( request ):
    if request.method == "POST":
        subject = request.POST['email-subject']
        message = request.POST['email-message']
        # The recipient must be a tuple or list.
        recipient = (request.POST['recipient-email'], )

        send_mail(subject, message, "RedAlertTester@gmail.com", recipient)

        return render(request, 'redAlertSite/send_email.html')

    else:
        return render(request, 'redAlertSite/send_email.html')

def send_sms_message( request ):
    if request.method =="POST":
        message = request.POST['sms-message']
        sender = '+19087749012'
        recipient = [request.POST['recipient-phone']]

        send_sms( message, sender, recipient, fail_silently=False )

        return render(request, 'redAlertSite/send_email.html')

    else:
        return render(request, 'redAlertSite/send_email.html')

def user_log_in( request ):
    return render(request, 'redAlertSite/user_login.html')


def auth_user_login( request ):
    user = authenticate(username= request.POST['user-name'], password=request.POST['user-pass'])
    if user is not None:
        # A backend authenticated the credentials
        return HttpResponseRedirect(reverse('red_alert_site:landing_page', args=(1,)))
    else:
        # No backend authenticated the credentials
        return HttpResponseRedirect(reverse('red_alert_site:landing_page', args=(0,)))

def search_clients( request):
    '''
    name_list = ['Johny', 'Bell', "Johnathan", "Connor", "Candace", "Bill", "Colton", "Ben"]
    for n in range(8):
        new_client = Client()
        new_client.name = name_list[n]
        new_client.email = random.randint(2000, 3000)
        new_client.age = random.randint(1, 100)

        new_client.save()
'''
    all_clients = Client.objects.all()

    context = {
               'all_clients': all_clients,
    }

    return render(request, 'redAlertSite/search_clients.html', context )

def execute_search( request ):
    client_query = request.POST['search-query']
    search_results = get_queryset( client_query )

    context = {
        'search_results': search_results,
    }

    return render(request, 'redAlertSite/search_clients_results.html', context )


def get_queryset( search_query ): # new

    print("SEARCH QUERY IS " + search_query )
    # If search query is number convert it to a number
    if search_query.isdigit():
        search_query = int( search_query )
        print("CONVERTED TO INT" )


    return Client.objects.filter(
        Q(age=search_query) | Q(name__icontains= search_query) | Q(email=search_query))
