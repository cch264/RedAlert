from django.shortcuts import render
# Import the userinfo model object so we can use it here.
from userLoginApp.models import UserInfo

# Get the User Auth object and the UserInfo Object
def show_profile_page( request ):

    # .get is used to retrieve a singel obj from the db, .filter is the equivalent to using 
    # .where and allows you to retreive a subset of objects from the db.
    # So here we are passing the user auth object to the view and also retrieving the UserInfo object that corresponds to the user Auth object
    # UserInfo.id DOES NOT CORRESPOND TO A MATCHING USER AUTH MODEL. A UserInfo.user_id corresponds to a UserAuth objects id field.
    context = { 'userAuthObj': request.user, 'userInfoObj': UserInfo.objects.get( user_id=request.user.id) }

    return render(request, 'UserPages/profilepage.html', context)


def show_automations( request ):
    return render(request, 'UserPages/automationpage.html')    

def show_faq( request ):
    return render(request, 'UserPages/faqpage.html')