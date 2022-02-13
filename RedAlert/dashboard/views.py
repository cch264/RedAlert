from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Import the client model from redAlertSite app.
from redAlertSite.models import Client
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/' )
def show_dashboard( request ):
    #create_client_list()
    #client_json = json.dumps( [{"msg": "yo", "amsg": "hello"}, {"msg": "val", "amsg": "hello"}] )

    all_clients_array = Client.objects.all()

    json_array = []
    for client in all_clients_array:
        a_client_dict = {}
        a_client_dict["id"] = client.id
        a_client_dict["name"] = client.name
        a_client_dict["email"] = client.email
        a_client_dict["age"] = client.age

        json_array.append( a_client_dict )

    #print( len( json_array ) )
    #print( str(json_array) )

    
    client_json = json.dumps( json_array )

    response = {
        'client_json' : client_json
    }
        
    return render(request, 'dashboard/dashboard.html', response)


def create_client_list():

    for index in range(50):
        a_client = Client()
        a_client.name = "bobby"



    

    





    

# EXAMPLE AJAX REQUEST RESPONSE METHOD.
# @csrf_exempt
def execute_search( request ):
    print("IN EXECUTE SEARCH")
    if request.is_ajax():
        print("IN EXECUTE SEARCH AJAX SECTION")
        # GEt the users query from the ajax request params
        user_query = request.POST.get('user_query', None) 

        response_str = "The users query was {}".format( user_query )

        response = [ 
            {'msg': response_str, 'amsg': "hello"},
            {'obj2': "val", "objTwo": "hello"}
                   ]

        return JsonResponse(response) # return response as JSON
