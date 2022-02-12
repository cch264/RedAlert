from django.shortcuts import render
from django.contrib.auth.decorators import login_required

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/' )
def show_dashboard( request ):
    return render(request, 'dashboard/dashboard.html')
    