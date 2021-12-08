from django.http import HttpResponse, HttpResponseRedirect
from django.template import loader
from django.shortcuts import get_object_or_404, render
from django.urls import reverse
from django.contrib.auth.models import User


# Create your views here.
# A view function is the code we run before showing a user a page so we can query the database and perform other functions
# like user authentication or creating a list of data to show on the web page.
def landing_page( request ):

    # Users are stored in the auth_user table!!!
    # User class is something built into Djanog, so you will not see a User object in the models.py file.
    #new_user = User.objects.create_user( 'Bobbyyyyy', "bobbyyy@email.com", '12345' )

    user_list = User.objects.all()

    context = {
               'user_list': user_list,
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
        recipient = request.POST['recipient-email']

        send_mail(subject, message, "RedAlertTester@gmail.com", recipient)

        return render(request, 'redAlertSite/send_email.html')

    else:
        return render(request, 'redAlertSite/send_email.html')
