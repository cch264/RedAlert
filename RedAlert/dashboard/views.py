from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Import the client model from redAlertSite app.
from redAlertSite.models import Client
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
import string
import datetime
from sms import send_sms
from django.core.mail import send_mail

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/' )
def show_dashboard( request ):

    #delete_all_clients()
    #create_client_list()

    #client_json = json.dumps( [{"msg": "yo", "amsg": "hello"}, {"msg": "val", "amsg": "hello"}] )

    all_clients_array = Client.objects.all()

    json_array = []
    for client in all_clients_array:
        a_client_dict = {}
        a_client_dict["id"] = client.id
        a_client_dict["name"] = client.name
        a_client_dict["unit_num"] = client.unit_num
        a_client_dict["street"] = client.street
        a_client_dict["city"] = client.city
        a_client_dict["zip_code"] = client.zip_code
        a_client_dict["state"] = client.state
        a_client_dict["license_num"] = client.license_num
        a_client_dict["policies"] = client.policies
        a_client_dict["age"] = client.age
        a_client_dict["birthdate"] = str(client.birthdate)
        a_client_dict["gender"] = client.gender
        a_client_dict["notification_status"] = client.notification_status
        a_client_dict["email"] = client.email
        a_client_dict["phone"] = client.phone


        json_array.append( a_client_dict )

    #print( len( json_array ) )
    #print( str(json_array) )


    client_json = json.dumps( json_array )

    response = {
        'client_json' : client_json
    }

    return render(request, 'dashboard/dashboard.html', response)


def create_client_list():

    names =["Zane Roman",
    "Mya Fry",
    "Kailyn Carney",
    "Cael Mcbride",
    "Derick Delgado",
    "Monserrat Vargas",
    "Rowan Buckley",
    "Magdalena Calderon",
    "Kameron Morgan",
    "Jasmine Glover",
    "Noel Thompson",
    "Kenny Quinn",
    "Jovanny Carrillo",
    "Miracle Patterson",
    "Fanni Azzurra",
    "Britt Peta",
    "Neema Marian",
    "Magomed Aldegar",
    "Cirino Tayla",
    "Nkechi Priya",
    "Nayden Urszula",
    "Alkmene Phokas",
    "Berrak Mauro"]

    #unit_num, street, City, State, Zip Code
    addresses = ["3908,E Bronco Trl,Phoenix,Arizona,85044 ".split(','),
     "11221,S 51st St,Phoenix,Arizona,85044".split(','),
     "4234,E Jicarilla St,Phoenix,Arizona(AZ),85044".split(','),
     "1055,W Baseline Rd,Phoenix,Arizona,85041".split(','),
     "2050,W Dunlap Ave,Phoenix,Arizona,85021".split(','),
     "4730,N 19th Ave,Phoenix,Arizona,85015".split(','),
     "2939,W Lamar Rd,Phoenix,Arizona,85017".split(','),
     "5201,N 8th Pl,Phoenix,Arizona,85014".split(','),
     "938,W Glenrosa Ave,Phoenix,Arizona,85013".split(','),
     "8829,S 51st St,Phoenix,Arizona,85044".split(','),
     "919,E Aire Libre Ave,Phoenix,Arizona,85022".split(','),
     "830,E Lawrence Rd,Phoenix,Arizona,85014".split(','),
     "8628,W Pima St,Phoenix,Arizona,85003".split(','),
     "723,E Roosevelt St,Phoenix,Arizona,85006".split(','),
     "901,S Country Club Dr,Mesa,Arizona,85210".split(','),
     "9233,E Neville Ave,Mesa,Arizona,85208".split(','),
     "9804,E Knowles Ave,Mesa,Arizona,85208".split(','),
     "3390,E Lockett Rd,Flagstaff,Arizona,86004".split(','),
     "3300,S Gila Dr,Flagstaff,Arizona,86001".split(','),
     "1830,S Milton Rd,Flagstaff,Arizona,86001".split(','),
     "8961,E Meadow Hill Dr,Scottsdale,Arizona,85260".split(','),
     "9494,E Redfield Rd,Scottsdale,Arizona,85260".split(','),
     "9848,E Thomas Rd,Scottsdale,Arizona,85256".split(',') ]

    policies = ['fire auto', 'fire', 'fire boat home', 'home', 'auto fire home', 'auto', 'boat home', 'home fire boat', 'pet home fire', 'pet', 'pet fire','boat fire', 'boat']
    gender = ["M","F"]
    notification_status =['all','emergency','none']
    emails = ["@gmail.com", "@nau.edu", "@cox.com", "@yahoo.com"]



    for index in range( len(addresses) ):
        a_client = Client()
        a_client.name = names[index]
        a_client.unit_num = addresses[index][0]
        a_client.street = addresses[index][1]
        a_client.city = addresses[index][2]
        a_client.state = addresses[index][3]
        a_client.zip_code = addresses[index][4]
        a_client.license_num = random.choice(string.ascii_uppercase ) + str(random.randint(10000000,99999999))
        a_client.policies = policies[random.randint(0, len(policies) - 1 )]
        # YYYY-MM-DD
        a_client.birthdate = datetime.date(random.randint(1920, 2005),random.randint(1, 12), random.randint(1, 28) )
        a_client.age = 2022 - a_client.birthdate.year
        a_client.gender = gender[ random.randint(0,1)]
        a_client.notification_status = notification_status[random.randint(0, len(notification_status) - 1)]
        #a_client.email = a_client.name.split(' ')[0] + emails[random.randint(0, len(emails) - 1 )]
        a_client.email = "npn24@nau.edu"
        #a_client.phone = "4803690030"
        a_client.phone = "13096202335"
        a_client.save()



    print("LENG OF CLIENTS COLLECTION IS: {}".format( len( Client.objects.all()) ) )


def delete_all_clients():
    client_list = Client.objects.all()

    for client in client_list:
        client.delete()










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

# method for sending messages (both email and SMS) out to clients
# Author: Nick Nannen
def send_message( request ):

    # define variables
    message_subject = request.POST['message_subject']
    message_body = request.POST['message_body']
    message_type = request.POST['message_type']
    message_priority = request.POST['message_priority']
    selected_clients = request.POST['selected_clients']

    # define constants
    EMERGENCY_MSG = "EMERGENCY ALERT FROM STATE FARM: "
    END_MSG = "Do not reply to this alert"

    # correctly format selected clients array
    selected_clients = selected_clients.split(" ")
    del selected_clients[-1]

    # correctly format message body
    message_body = message_body.strip()

    # test code for ensuring correct clients are selected
    #print( selected_clients )

    # test code for ensuring all data has been recieved and is correct
    #print("Subject: {}\n Message: {}\n Type: {}\n Priority: {}\n Selected Clients: {}\n".format(message_subject, \
    #message_body, message_type, message_priority, selected_clients))

    # query clients from database based on seleceted client's IDs
    selected_clients_array = Client.objects.filter(id__in=selected_clients)

    # define array for containing client's names, email addresses, and phone numbers
    selected_client_info = []

    # loop through selected clients and get each's contact info
    for client_index in selected_clients_array:
        # get client name, email, and phone and store in array
        selected_client_info.append([client_index.name, client_index.email, str(client_index.phone)])

    # test code for making sure emails and phone numbers are correctly stored
    #print("Selected Emails: {}\n".format(selected_emails))
    #print("Selected Phones: {}\n".format(selected_phones))

    # if "Send Email" is selected, then call the send_mail function with data
    if message_type == "send-email":
        for client_index in selected_client_info:
            # if the alert is marked as an emergency, format as such
            if message_priority == "send-emergency":
                subject_temp = EMERGENCY_MSG + message_subject
                message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                + "\n\n" + END_MSG
            # otherwise, format as a social alert
            else:
                subject_temp = "State Farm alert system - " + message_subject
                message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + END_MSG

            # send the email to the client
            send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

            # test code to make sure email is sent to the correct address
            #print("Sent to: {}\n".format(email_index))

    # if "Send SMS" is selected, then call the send_sms function with data
    elif message_type == "send-sms":
        for client_index in selected_client_info:
            # if the alert is marked as an emergency, format as such
            if message_priority == "send-emergency":
                message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                "\n\n" + message_body + "\n\n" + END_MSG
            # otherwise, format as a social alert
            else:
                message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " \
                + client_index[0] + "\n\n" + message_body + "\n\n"  + END_MSG

            # send the SMS message to the client
            send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

            # test code to make sure sms is sent to the correct number
            #print("Sent to: {}\n".format(sms_index))

    # if "Send Email and SMS" is selected, then call both functions with data
    else:
        for client_index in selected_client_info:
            # formatting for SMS
            # if the alert is marked as an emergency, format as such
            if message_priority == "send-emergency":
                message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                "\n\n" + message_body + "\n\n"  + END_MSG
            # otherwise, format as a social alert
            else:
                message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] \
                + "\n\n" + message_body + "\n\n"  + END_MSG

            # send the SMS message to the client
            send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

            # formatting for email
            # if the alert is marked as an emergency, format as such
            if message_priority == "send-emergency":
                subject_temp = EMERGENCY_MSG + message_subject
                message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                + "\n\n"  + END_MSG
            # otherwise, format as a social alert
            else:
                subject_temp = "State Farm alert system - " + message_subject
                message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + END_MSG

            # send the email to the client
            send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

            # test code to make sure email is sent to the correct address
            #print("Sent to: {}\n".format(email_index))

            # test code to make sure sms is sent to the correct number
            #print("Sent to: {}\n".format(sms_index))

    # send json response back
    response = {'Success': 'True'}
    return JsonResponse(response)
