from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Import the client model from redAlertSite app.
from redAlertSite.models import Client
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/' )
def show_dashboard( request ):
    return render(request, 'dashboard/dashboard.html')


# @csrf_exempt
def execute_search( request ):
    print("IN EXECUTE SEARCH")
    if request.is_ajax():
        print("IN EXECUTE SEARCH AJAX SECTION")
        # GEt the users query from the ajax request params
        user_query = request.POST.get('user_query', None) 

        response_str = "The users query was {}".format( user_query )

        response = {
                        'msg': response_str
        }

        return JsonResponse(response) # return response as JSON



    '''
    client_query = request.POST['search-query']
    search_results = get_queryset( client_query )

    context = {
        'search_results': search_results,
    }

    return render(request, 'redAlertSite/search_clients_results.html', context )
    '''


def get_queryset( search_query ): # new

    print("SEARCH QUERY IS " + search_query )
    # If search query is number convert it to a number
    if search_query.isdigit():
        search_query = int( search_query )
        print("CONVERTED TO INT" )


    return Client.objects.filter(
        Q(age=search_query) | Q(name__icontains=search_query) | Q(email=search_query))


# ajax_posting function
def ajax_posting(request):
    if request.is_ajax():
        first_name = request.POST.get('first_name', None) # getting data from first_name input 
        last_name = request.POST.get('last_name', None)  # getting data from last_name input
        if first_name and last_name: #cheking if first_name and last_name have value
            response = {
                         'msg':'Your form has been submitted successfully' # response message
            }
            return JsonResponse(response) # return response as JSON
    