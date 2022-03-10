from django.shortcuts import render
# Import the userinfo model object so we can use it here.
from userLoginApp.models import UserInfo
from django.http import HttpResponse, HttpResponseRedirect
from django.contrib.auth.models import User
from django.urls import reverse
from dashboard.models import OneTimeAutomation
from dashboard.models import RecurringAutomation

# Get the User Auth object and the UserInfo Object
def show_profile_page( request ):

    print("Ran show profile page view")

    # .get is used to retrieve a singel obj from the db, .filter is the equivalent to using 
    # .where and allows you to retreive a subset of objects from the db.
    # So here we are passing the user auth object to the view and also retrieving the UserInfo object that corresponds to the user Auth object
    # UserInfo.id DOES NOT CORRESPOND TO A MATCHING USER AUTH MODEL. A UserInfo.user_id corresponds to a UserAuth objects id field.
    context = { 'userAuthObj': request.user, 'userInfoObj': UserInfo.objects.get( user_id=request.user.id) }

    return render(request, 'UserPages/profilepage.html', context)


def show_automations( request ):
    oneTimeAutos = OneTimeAutomation.objects.all()
    recurringAutos = RecurringAutomation.objects.all()

    context = {'oneTimeAutos': oneTimeAutos, 'recurringAutos': recurringAutos}

    return render(request, 'UserPages/automationpage.html', context)    

def show_faq( request ):
    return render(request, 'UserPages/faqpage.html')


def update_user_profile( request ):

    # Get the user info object
    userInfoObj = UserInfo.objects.get( user_id=request.user.id )

    # Get the user auth object
    userAuthObj = User.objects.get( id=request.user.id )

    if( request.POST['changed-password'] == "true"):
        userAuthObj.set_password( request.POST['pass-1'] )
        userChangedPass = True
    else:
        userChangedPass = False


    userAuthObj.first_name = request.POST['first_name']
    userAuthObj.last_name = request.POST['last_name']


    # turn the filtered array into a dictionary, filter returns an iterator. .items() turns the dictionary into an array of tuples
    postRequestFiltered = dict( filter( removeUserAuthData, request.POST.items() ) )

    print("Unfiltered POST is {}".format( request.POST ) )
    print("Filtered POST is {}".format( postRequestFiltered) )

    # Get user object
    for key, value in postRequestFiltered.items():
       setattr(userInfoObj, key, value)

    userInfoObj.save()

    userAuthObj.save()

    # If user did not change their password redirect back to profile page.
    if not userChangedPass:
        return HttpResponseRedirect( reverse('user_pages_urls:show_profile_page') )

    else:
        return HttpResponseRedirect( reverse('loginAppUrls:login_after_pass_change', args=['pass_change']) )

# Removes userAuth info from the post request dictionary so we can iterate through the post request array without worrying about data that doesnt belong in the userInfo model.
def removeUserAuthData( dictTuple ):

    dictKeyName = dictTuple[0]
    print("Array item is: {}".format( dictKeyName ))
    # Func returns true, element stays in array
    if( dictKeyName == "pass-1" or dictKeyName == "pass-2" or dictKeyName == "email" or dictKeyName == "first_name" or dictKeyName == "last_name" or dictKeyName == "csrfmiddlewaretoken" or dictKeyName == "changed-password"):
        return False
    else:
        return True





