from django.shortcuts import render
# Import the userinfo model object so we can use it here.
from userLoginApp.models import UserInfo
from django.http import HttpResponse, HttpResponseRedirect, JsonResponse
from django.contrib.auth.models import User
from django.urls import reverse
from dashboard.models import OneTimeAutomation
from dashboard.models import RecurringAutomation
from dashboard.models import Subset
from dashboard.models import SavedSearches
from dashboard.views import *



# Get the User Auth object and the UserInfo Object
@login_required( login_url='/')
def show_profile_page( request ):

    print("Ran show profile page view")

    # .get is used to retrieve a singel obj from the db, .filter is the equivalent to using
    # .where and allows you to retreive a subset of objects from the db.
    # So here we are passing the user auth object to the view and also retrieving the UserInfo object that corresponds to the user Auth object
    # UserInfo.id DOES NOT CORRESPOND TO A MATCHING USER AUTH MODEL. A UserInfo.user_id corresponds to a UserAuth objects id field.
    context = { 'userAuthObj': request.user, 'userInfoObj': UserInfo.objects.get( user_id=request.user.id) }

    return render(request, 'UserPages/profilepage.html', context)

@login_required( login_url='/')
def show_automations( request ):

    print("USER ID IS {}".format( request.user.id ))
    oneTimeAutos = OneTimeAutomation.objects.filter(user_id = request.user.id ) # Use the auth user id to get the automations for THIS user only.
    hasOneTimeAutos = oneTimeAutos.exists()

    recurringAutos = RecurringAutomation.objects.filter(user_id = request.user.id )
    hasRecurringAutos = recurringAutos.exists()

    hasAutos = hasOneTimeAutos or hasRecurringAutos

    # Grab the subsets for the current agent/user
    saved_subset_objects = Subset.objects.filter(user_id=request.user.id)
    hasSubsets = saved_subset_objects.exists()

    savedSearches = SavedSearches.objects.filter(user_id=request.user.id)
    hasSavedSearches = savedSearches.exists()

    context = {'oneTimeAutos': oneTimeAutos,
               'recurringAutos': recurringAutos,
               'hasAutos':hasAutos,
               'savedSearches': savedSearches,
               'hasSavedSearches': hasSavedSearches,
               'saved_subsets': saved_subset_objects,
               'has_subsets' :hasSubsets
               }

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

def update_automation( request ):

    print("Request Dictionary is: {}".format( request.POST ))
    response = {'Success': 'True'}




    if request.POST['message_freq'] == "many":
        newRecurringAuto = RecurringAutomation.objects.get(id=request.POST['auto_id'] )
        newRecurringAuto.name = request.POST['auto_name']
        newRecurringAuto.start_date = request.POST['send_msg_many_start_date']
        newRecurringAuto.start_date_str = request.POST['send_msg_many_start_date']
        newRecurringAuto.msg_body = request.POST['message_body']
        newRecurringAuto.msg_sub = request.POST['message_subject']
        newRecurringAuto.msg_type = request.POST['message_type']
        newRecurringAuto.msg_priority = request.POST['message_priority']
        newRecurringAuto.send_msg_freq_unit = request.POST['send_msg_many_unit']
        newRecurringAuto.save()

        # Delete the previously scheduled job for this automation.
        deleteSchedJob( newRecurringAuto.id, "many")

         #newRecurringAuto.send_msg_freq Dont do anything with this field rn as it has a default for the moment.
    else:

        newOneTimeAuto = OneTimeAutomation.objects.get(id=request.POST['auto_id'] )

        newOneTimeAuto.name = request.POST['auto_name']
        newOneTimeAuto.date = request.POST['send_msg_once_date']
        newOneTimeAuto.date_str = request.POST['send_msg_once_date']
        newOneTimeAuto.msg_body = request.POST['message_body']
        newOneTimeAuto.msg_sub = request.POST['message_subject']
        newOneTimeAuto.msg_type = request.POST['message_type']
        newOneTimeAuto.msg_priority =  request.POST['message_priority']
        newOneTimeAuto.save()

        # Delete the previously scheduled job for this automation.
        deleteSchedJob( newOneTimeAuto.id, "one")



    # We just deleted a previous sheduled job, now lets refresh the sched job list so the job for this automation is recreated.
    refreshSchedJobs()

    return JsonResponse(response)


def delete_automation( request ):

    if request.POST['type'] == "many":
        automationObj = RecurringAutomation.objects.get(id=request.POST['autoID'] )

        deleteSchedJob( automationObj.id, "many")

        automationObj.delete()

        response = {'Success': 'Deleted recurring automation'}


        return JsonResponse(response)

    elif request.POST['type'] == "one":
        oneTimeAuto = OneTimeAutomation.objects.get(id=request.POST['autoID'] )

        deleteSchedJob( oneTimeAuto.id, "one")

        oneTimeAuto.delete()

        response = {'Success': 'Deleted One Time Automation'}

        return JsonResponse(response)

    else:
        print("Delete Automation: Auto type not found.")

        response = {'Failure': 'Failed to delete automation'}

        return JsonResponse(response)


def delete_search(request):

    saved_search = SavedSearches.objects.get(id=request.POST['searchID'])

    saved_search.delete()

    response = {'success': 'true'}

    return JsonResponse(response)

def update_search(request):

    saved_search = SavedSearches.objects.get(id=request.POST['searchID'])

    saved_search.name = request.POST['searchName']
    saved_search.query = request.POST['searchQuery']

    saved_search.save()

    response = {'success': 'true'}

    return JsonResponse(response)

def update_subset(request):

    saved_subset = Subset.objects.get(id=request.POST['subsetID'])

    saved_subset.name = request.POST['subsetName']

    saved_subset.save()

    response = {'success': 'true'}

    return JsonResponse(response)

def delete_subset( request ):
    saved_subset = Subset.objects.get(id=request.POST['subsetID'])
    saved_subset.delete()

    response = {'success': 'true'}

    return JsonResponse(response)


# Returns a json of client objects for a specific modal on the automation page.
# Get client data to display to user when viewing automation or subset so they know what clients are
# part of the automation or subset.
def retrieve_clients_for_modals( request ):

    resourceID = request.POST['resourceID']
    resourceType = request.POST['resourceType']

    if resourceType == "once": # If resource type is recurring automation
        resourceObj = OneTimeAutomation.objects.get(id=resourceID)
        clientsArray = resourceObj.selected_clients.split(',') # We store clients associated with a resource as a comma seperated string, so we are breaking it into an array of individual client ids.

    elif resourceType == "many": # If resource type is one time automation
        resourceObj = RecurringAutomation.objects.get(id=resourceID)
        clientsArray = resourceObj.selected_clients.split(',')

    else: # Else if the resource is a subset.
        resourceObj = Subset.objects.get(id=resourceID)
        clientsArray = resourceObj.clientIDs.split(',')

    clientObjects = Client.objects.filter(id__in=clientsArray)

    json_array = []
    for client in clientObjects:
        clientDict = {}
        clientDict["id"] = client.id
        clientDict["name"] = client.name
        '''
        clientDict["unit_num"] = client.unit_num
        clientDict["street"] = client.street
        clientDict["city"] = client.city
        clientDict["zip_code"] = client.zip_code
        clientDict["state"] = client.state
        clientDict["license_num"] = client.license_num
        clientDict["policies"] = client.policies
        clientDict["age"] = client.age
        clientDict["birthdate"] = str(client.birthdate)
        clientDict["gender"] = client.gender
        clientDict["notification_status"] = client.notification_status
        clientDict["email"] = client.email
        clientDict["phone"] = client.phone
        clientDict["lat"] = client.lat
        clientDict["long"] = client.long
        '''
        json_array.append(clientDict)


    json_array = json.dumps(json_array)
    print("Client Objects for resource {} resource id is: {}".format(clientObjects, resourceID))

    response = {'success': 'true', 'clients': json_array}

    return JsonResponse(response)
