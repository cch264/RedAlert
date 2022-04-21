import sched
from django.shortcuts import render
from django.contrib.auth.decorators import login_required
# Import the client model from redAlertSite app.
from redAlertSite.models import Client
from .models import Subset
from django.db.models import Q
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
import json
import random
import string
from .models import OneTimeAutomation
from .models import RecurringAutomation
from .models import SavedSearches
from django.db import models
from django.core.exceptions import ObjectDoesNotExist
from django.http import HttpResponse, HttpResponseRedirect
from django.urls import reverse
from sms import send_sms
from django.core.mail import send_mail
import email
import imaplib
import environ


#import datetime
from datetime import date
from datetime import datetime

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_STOPPED, STATE_RUNNING, STATE_PAUSED


# define and read env files
env = environ.Env()
environ.Env.read_env()

# Initialize the background schedular
scheduler = BackgroundScheduler()
schedulerInitialStart = True

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/')
def show_dashboard( request ):

    userHasClients = True
    # Dont run this functin when the dashboar loads if the scheduler is already running.
    # This is how we start the schedular on server restart. Not the best solution but it works fine for now.
    if scheduler.state != STATE_RUNNING:
        refreshSchedJobs()
        print("Initiliazing shed jobs for first time.")
        new_job = scheduler.add_job(get_email_response, 'cron', second=1, id = 'get_email_responses' )
    else:
        print("Not Initiliazing Jobs for first time. Printing Sheduled Jobs: {}".format(scheduler.get_jobs()) )

    #delete_all_clients()
    #create_client_list(request)

    print("Length of clients retreived from db  {}".format( len( Client.objects.filter(user_id=request.user.id) ) ) )

    if len( Client.objects.filter(user_id=request.user.id) ) == 0:
        print("NO CLIENTS ASSOCIATED WITH THIS ACCOUNT!!!!")
        userHasClients = False

    #client_json = json.dumps( [{"msg": "yo", "amsg": "hello"}, {"msg": "val", "amsg": "hello"}] )

    all_clients_array = Client.objects.filter(user_id=request.user.id)

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
        a_client_dict["lat"] = client.lat
        a_client_dict["long"] = client.long


        json_array.append( a_client_dict )

    #print( len( json_array ) )
    #print( str(json_array) )

    saved_subset_objects = Subset.objects.filter(user_id=request.user.id)
    has_subset = saved_subset_objects.exists()

    saved_search_objects = SavedSearches.objects.filter(user_id=request.user.id)
    saved_search_array = []

    for search in saved_search_objects:
        saved_search_array.append( [search.name, search.query] )

    print(saved_search_array)

    client_json = json.dumps( json_array )

    response = {
        'client_json' : client_json,
        'saved_subsets' : saved_subset_objects,
        'hasSubsets' : has_subset,
        'userHasClients':userHasClients,
        'saved_searches': saved_search_array,
        'has_saved_searches' : saved_search_objects.exists()
    }

    return render(request, 'dashboard/dashboard.html', response)


def create_client_list(request):

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

    # These correspond to the addresses above.
    longLat = [
        # Order is lat, long contrary to the name lol
        [33.3409064444445,	-111.998838666667],
        [33.3451534769561,	-111.974255629502],
        [33.348566684932,	-111.992154585402],
        [33.3776073884457,	-112.086657159916],
        [33.56969965,	-112.103388108672],
        [33.5061482222222,	-112.099985833333],
        [33.5361629115168,	-112.123175020013],
        [33.512979,	-112.06271],
        [33.4985806510067,	-112.085733496644],
        [33.3649547680338,	-111.971815911598],
        [33.63604865,	-112.061387013499],
        [33.5356290909091,	-112.062408121212],
        [33.4330644,	-112.1008284],
        [33.4586047664523,	-112.064775064221],
        [33.398806,	-111.839312],
        [33.36724975,	-111.6336074689],
        [33.3784966969697,	-111.623984090909],
        [35.21868855,	-111.597247788542],
        [35.1666589,	-111.658973392651],
        [35.1815828,	-111.65844995],
        [33.6137616,	-111.8453885],
        [33.615277,	-111.876497411765],
        [33.4803402,	-111.9094363],
     ]

    policies = ['fire auto', 'fire', 'fire boat home', 'home', 'auto fire home', 'auto', 'boat home', 'home fire boat', 'pet home fire', 'pet', 'pet fire','boat fire', 'boat']
    gender = ["M","F"]
    notification_status =['all','emergency','none']
    #emails = ["@gmail.com", "@nau.edu", "@cox.com", "@yahoo.com"]
    emails = ["cch264@nau.edu", "npn24@nau.edu", "sng235@nau.edu", "mkd97@nau.edu"]
    phones = ["14803690030", "13096202335", "19285668342"]



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
        a_client.birthdate = datetime(random.randint(1920, 2005),random.randint(1, 12), random.randint(1, 28) )
        a_client.age = 2022 - a_client.birthdate.year
        a_client.gender = gender[ random.randint(0,1)]
        a_client.notification_status = notification_status[random.randint(0, len(notification_status) - 1)]
        a_client.lat = longLat[index][0]
        a_client.long = longLat[index][1]
        #a_client.email = emails[random.randint(0, len(emails) - 1 )]
        #a_client.phone = phones[random.randint(0, len(phones) - 1 )]
        #a_client.email = a_client.name.split(' ')[0] + emails[random.randint(0, len(emails) - 1 )]
        a_client.email = "calvin7757@gmail.com"
        a_client.phone = "16026975905" # Kamerons phone number.
        #a_client.email = "calvin7757@gmail.com"
        #a_client.phone = "14803690030"
        a_client.user_id = request.user.id

        a_client.save()



    print("LENG OF CLIENTS COLLECTION IS: {}".format( len( Client.objects.all()) ) )


def delete_all_clients():
    client_list = Client.objects.all()

    for client in client_list:
        client.delete()


def generate_clients_from_dashboard(request):

    create_client_list(request)

    return HttpResponseRedirect( reverse('dashboard_urls:dashboard_page') )


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
    EMAIL_END_MSG = 'Reply "STOP ALL" to unsubscribe from all alerts or "STOP SOCIAL" to only recieve emergency alerts.'
    SMS_END_MSG = 'Reply "STOP" to unsubscribe from all alerts.'

    # correctly format selected clients array
    selected_clients = selected_clients.split(",")

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
        selected_client_info.append([client_index.name, client_index.email, str(client_index.phone), client_index.notification_status])

    # test code for making sure emails and phone numbers are correctly stored
    #print("Selected Emails: {}\n".format(selected_emails))
    #print("Selected Phones: {}\n".format(selected_phones))

    # if all fields are filled out...
    if( message_body != "" and message_subject != "" and message_priority != "def-select-opt" and message_type != "def-select-opt" ):
        # if "Send Email" is selected, then call the send_mail function with data
        if message_type == "email":
            for client_index in selected_client_info:
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    subject_temp = EMERGENCY_MSG + message_subject
                    message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                    + "\n\n" + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    subject_temp = "State Farm alert system - " + message_subject
                    message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # test code to make sure email is sent to the correct address
                #print("Sent to: {}\n".format(email_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)

        # if "Send SMS" is selected, then call the send_sms function with data
        elif message_type == "sms":
            for client_index in selected_client_info:
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                    "\n\n" + message_body + "\n\n" + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )


                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " \
                    + client_index[0] + "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # test code to make sure sms is sent to the correct number
                #print("Sent to: {}\n".format(sms_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)

        # if "Send Email and SMS" is selected, then call both functions with data
        else:
            for client_index in selected_client_info:
                # formatting for SMS
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency"  and client_index[3] != 'none':
                    message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                    "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] \
                    + "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # formatting for email
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    subject_temp = EMERGENCY_MSG + message_subject
                    message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                    + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    subject_temp = "State Farm alert system - " + message_subject
                    message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # test code to make sure email is sent to the correct address
                #print("Sent to: {}\n".format(email_index))

                # test code to make sure sms is sent to the correct number
                #print("Sent to: {}\n".format(sms_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)


def get_email_response():
    # get environment data
    EMAIL = env("EMAIL_ADDRESS")
    PASSWORD = env("EMAIL_PASS")
    SERVER = env("EMAIL_HOST")

    # connect to the server and go to its inbox
    mail = imaplib.IMAP4_SSL(SERVER)
    mail.login(EMAIL, PASSWORD)
    mail.select('inbox')

    # search using the ALL criteria to retrieve every message inside the inbox
    # and get its status and a list of ids
    status, data = mail.search(None, 'ALL')

    # the list returned is a list of bytes separated by white spaces on this format: [b'1 2 3', b'4 5 6']
    # create an empty list
    mail_ids = []

    # go through the list splitting its blocks of bytes and adding to the mail_ids list
    for block in data:
        mail_ids += block.split()

    # for every id we'll fetch the email and extract its content
    for mail_id_index in mail_ids:
        # fetch the email given its id and format of the message
        status, data = mail.fetch(mail_id_index, '(RFC822)')

        # content data at the '(RFC822)' format comes in a list with a tuple with header, content, and the closing
        # byte b')'
        # iterate through this list
        for response_part in data:
            # if its a tuple go for the content at its second element
            if isinstance(response_part, tuple):
                message = email.message_from_bytes(response_part[1])

                # extract the info about sender of the message and format correctly
                temp_from = message['from'].split('<')
                temp_from = temp_from[1].split('>')
                mail_from = temp_from[0]

                # if its not plain text, separate the message from its annexes to get the text
                if message.is_multipart():
                    mail_content = ''

                    # multipart we has the text message and other things like annex, and html version
                    # of the message
                    # loop through the email payload
                    for part in message.get_payload():
                        # if the content type is text/plain, extract it
                        if part.get_content_type() == 'text/plain':
                            mail_content += part.get_payload()
                else:
                    # if the message isn't multipart, extract it
                    mail_content = message.get_payload()

                # convert the content into a string
                mail_content = str(mail_content)

                # import clients whose email matches the sender's from the database
                currentClients = Client.objects.filter(email=mail_from)

                # set message strings
                notif_status_subject = 'State Farm alert system - Notification Status Alert'
                stop_all_msg = 'All alerts have been stopped for email address: ' + mail_from + \
                '. You will now not recieve any alerts.' + '\n\nReply "START ALL" to resubscribe to all alerts'
                stop_social_msg = 'Social alerts have been stopped for email address: ' + mail_from + \
                '. You will now recieve only emergency alerts.' + '\n\nReply "START SOCIAL" to resubscribe to social alerts'

                # if a 'STOP' is found, look for strings 'ALL' or "SOCIAL"
                if mail_content.find('STOP') != -1:
                    # if 'ALL' is found, set client's notification_status to none
                    if mail_content.find('ALL') != -1:
                        for clientIndex in currentClients:
                            clientIndex.notification_status = 'none'
                            # save the client's updated entry
                            clientIndex.save()
                            # send confirmation of notification change
                            send_mail(notif_status_subject, stop_all_msg, "RedAlertTester@gmail.com", [mail_from])

                            #print(f'STOPPING ALL NOTIFICATIONS FOR: {mail_from}')
                            #print(f'Name: {clientIndex.name}, Notification Status: {clientIndex.notification_status}\n')

                    # if 'SOCIAL' is found, set client's notification_status to emergency
                    elif mail_content.find('SOCIAL') != -1:
                        for clientIndex in currentClients:
                            clientIndex.notification_status = 'emergency'
                            # save the client's updated entry
                            clientIndex.save()
                            # send confirmation of notification change
                            send_mail(notif_status_subject, stop_social_msg, "RedAlertTester@gmail.com", [mail_from])

                            #print(f'STOPPING SOCIAL NOTIFICATIONS FOR: {mail_from}')
                            #print(f'Name: {clientIndex.name}, Notification Status: {clientIndex.notification_status}\n')

                # set message strings
                start_all_msg = 'All alerts have been started for email address: ' + mail_from + \
                '. You will now recieve social and emergency alerts.' + '\n\nReply "STOP ALL" to unsubscribe from all alerts or "STOP SOCIAL" to only recieve emergency alerts.'
                start_social_msg = 'Social alerts have been started for email address: ' + mail_from + \
                '. You will now recieve social alerts.' + '\n\nReply "STOP ALL" to unsubscribe from all alerts or "STOP SOCIAL" to only recieve emergency alerts.'

                # if a 'START' is found, look for strings 'ALL' or "SOCIAL"
                if mail_content.find('START') != -1:
                    # if 'ALL' is found, set client's notification_status to all
                    if mail_content.find('ALL') != -1:
                        for clientIndex in currentClients:
                            clientIndex.notification_status = 'all'
                            # save the client's updated entry
                            clientIndex.save()
                            # send confirmation of notification change
                            send_mail(notif_status_subject, start_all_msg, "RedAlertTester@gmail.com", [mail_from])

                            #print(f'STARTING ALL NOTIFICATIONS FOR: {mail_from}')
                            #print(f'Name: {clientIndex.name}, Notification Status: {clientIndex.notification_status}\n')

                    # if 'SOCIAL' is found, set client's notification_status to all
                    elif mail_content.find('SOCIAL') != -1:
                        for clientIndex in currentClients:
                            clientIndex.notification_status = 'all'
                            # save the client's updated entry
                            clientIndex.save()
                            # send confirmation of notification change
                            send_mail(notif_status_subject, start_social_msg, "RedAlertTester@gmail.com", [mail_from])

                            #print(f'STARTING SOCIAL NOTIFICATIONS FOR: {mail_from}')
                            #print(f'Name: {clientIndex.name}, Notification Status: {clientIndex.notification_status}\n')

    # if there are emails found, delete them after all operations have completed
    if len(mail_ids) > 0:
        # define the range for the operation
        start = mail_ids[0].decode()
        end = mail_ids[-1].decode()

        # move the emails to the trash
        mail.store(f'{start}:{end}'.encode(), '+X-GM-LABELS', '\\Trash')

        # access the Gmail trash
        mail.select('[Gmail]/Trash')

        # mark the emails to be deleted
        mail.store("1:*", '+FLAGS', '\\Deleted')

        # remove permanently the emails
        mail.expunge()

    # close the mailboxes
    mail.close()
    # close the connection
    mail.logout()


# Function that takes an ajax request and creates a new automation.
def save_automation( request ):
    print("Request Dictionary is: {}".format( request.POST ))

    response = {'Success': 'True'}

    print("Clients array? {}".format( request.POST['selected_clients'] ) )


    if request.POST['message_freq'] == "many":
        newRecurringAuto = RecurringAutomation()
        newRecurringAuto.name = request.POST['auto_name']
        newRecurringAuto.start_date = request.POST['send_msg_many_start_date']
        newRecurringAuto.start_date_str = request.POST['send_msg_many_start_date']
        newRecurringAuto.msg_body = request.POST['message_body']
        newRecurringAuto.msg_sub = request.POST['message_subject']
        newRecurringAuto.msg_type = request.POST['message_type']
        newRecurringAuto.msg_priority = request.POST['message_priority']
        newRecurringAuto.selected_clients = request.POST['selected_clients']
        newRecurringAuto.send_msg_freq_unit = request.POST['send_msg_many_unit']
        newRecurringAuto.user_id = request.user.id
        newRecurringAuto.save()

        #newRecurringAuto.send_msg_freq Dont do anything with this field rn as it has a default for the moment.
    else:
        newOneTimeAuto = OneTimeAutomation()

        newOneTimeAuto.name = request.POST['auto_name']
        newOneTimeAuto.date = request.POST['send_msg_once_date']
        newOneTimeAuto.date_str = request.POST['send_msg_once_date']
        newOneTimeAuto.msg_body = request.POST['message_body']
        newOneTimeAuto.msg_sub = request.POST['message_subject']
        newOneTimeAuto.msg_type = request.POST['message_type']
        newOneTimeAuto.msg_priority =  request.POST['message_priority']
        newOneTimeAuto.selected_clients =  request.POST['selected_clients']
        newOneTimeAuto.user_id= request.user.id
        newOneTimeAuto.save()


    # call this after each automation is added to create a sheduled job.
    refreshSchedJobs()

    return JsonResponse(response)


# Iterates through the automation collections and either creates new scheduled jobs from automations that havent been shceduled or reshedules jobs that may have been lost due to system restart.
# Called on system load and when a new automation is added or edited.
def refreshSchedJobs( ):

    markOneTimeAutosAsInactive()

    all_jobs = scheduler.get_jobs()

    job_id_array = []

    all_one_time_autos = OneTimeAutomation.objects.filter(active__in=[True]) # Only get one time automations that have not run yet.

    all_recurr_autos = RecurringAutomation.objects.all()

    print("All one time ids {}::: All recurring ids {}".format(all_one_time_autos, all_recurr_autos) )

    print("All jobs currently scheduled: {}".format(all_jobs) )

    for job in all_jobs:
        job_id_array.append(job.id)

    print("Job ID array after creation: {}".format( job_id_array ))

    for one_time_auto in all_one_time_autos:
        if one_time_auto.msg_type == "test_one_time_auto" and ("O" + str(one_time_auto.id) ) not in job_id_array:
            new_job = scheduler.add_job(send_auto_message, 'date', [one_time_auto.id, "one"], run_date = datetime( datetime.now().year, datetime.now().month, datetime.now().day, datetime.now().hour, datetime.now().minute + 1), id = "O" + str(one_time_auto.id),name=one_time_auto.name )
            print("Creating one time automation test. ID: {}::: Run Date is {}".format( one_time_auto.id, datetime( datetime.now().year, datetime.now().month, datetime.now().day, datetime.now().hour, datetime.now().minute + 1) ))

        elif ("O" + str(one_time_auto.id) ) not in job_id_array:
            print("Creating new one time automation shed. ID: {}::: Date obj is {}".format( one_time_auto.id, one_time_auto.date ))

            auto_year = one_time_auto.date_str[0:4]
            auto_month = one_time_auto.date_str[5:7]
            auto_day = one_time_auto.date_str[8:10]

            # Shed the job for 8am on the date specified by user. Sends the notifications at 17 UTC, which is 10am MST.
            new_job = scheduler.add_job(send_auto_message, 'date', [one_time_auto.id, "one"], run_date = datetime( int(auto_year), int(auto_month), int(auto_day), 17, 0), id = "O" + str(one_time_auto.id),name=one_time_auto.name )
        else:
            print("One time auto already has a scheduled job, skipping...")

    for recurr_auto in all_recurr_autos:
        if recurr_auto.msg_type == "test_recurr_auto" and ("R" + str(recurr_auto.id) ) not in job_id_array:
            new_job = scheduler.add_job(send_auto_message, 'cron', [recurr_auto.id, "many"], minute="*", start_date = datetime.now(), id = "R" + str(recurr_auto.id), name= recurr_auto.name  ) # Executes the function every minute.
            print("Creating recurring automation TEST. ID: {}::: Date start str is {}".format( recurr_auto.id, datetime.now() ))
        elif ("R" + str(recurr_auto.id) ) not in job_id_array:
            print("Creating recurring automation shed. ID: {}::: Date str is {}".format( recurr_auto.id, recurr_auto.start_date_str ))

            auto_unit = recurr_auto.send_msg_freq_unit

            if auto_unit == "month":
                # Params: add_job( function _to_execute, job_type, function params in order, months to send message, day to send message, eariliest date notification will be sent, id assigned ot the job, and name of job.,)
                new_job = scheduler.add_job(send_auto_message, 'cron', [recurr_auto.id, "many"], month='1-12', day="1st mon", hour="17", start_date = recurr_auto.start_date, id = "R" + str(recurr_auto.id),name=recurr_auto.name ) # Executes the function monthly.
            elif auto_unit == "week":
                new_job = scheduler.add_job(send_auto_message, 'cron', [recurr_auto.id, "many"],  day_of_week='mon', hour="17", start_date = recurr_auto.start_date, id = "R" + str(recurr_auto.id),name=recurr_auto.name ) # Executes the function monthly.,
            else:
                new_job = scheduler.add_job(send_auto_message, 'cron', [recurr_auto.id, "many"], hour="17", start_date = recurr_auto.start_date, id = "R" + str(recurr_auto.id), name= recurr_auto.name  ) # Executes the function monthly.,
        else:
            print("Recurring auto already has a scheduled job, skipping...")


    print("All jobs scheduled. Sheduled jobs: {}".format( scheduler.get_jobs() ) )

       # start the scheduler if its not already running.
    if scheduler.state != STATE_RUNNING:
        print("STARTING SCHEDULER")
        scheduler.start()
    else:
        print("NOT starting Scheduler")


def task():
    print("Testing schedular")


# method for sending messages (both email and SMS) out to clients without using a post request. Used for sending automated messages.
# Author: Nick Nannen. Modified by Calvin H.
def send_auto_message( autoID, type ):

    if type == "one":
        automation = OneTimeAutomation.objects.get(id=autoID)
        automation.active = False
        automation.save()
    else:
        automation = RecurringAutomation.objects.get(id=autoID)

    # define variables
    message_subject = automation.msg_sub
    message_body = automation.msg_body
    message_type = automation.msg_type

    # We change the type of the auto to signify this is a test autoamtion that gets send every minute.
    if (message_type == "test_one_time_auto") or (message_type == "test_recurr_auto"):
        message_body += " Message Sent on:" + str(datetime.now())
        message_type = "both"

    message_priority = automation.msg_priority
    selected_clients = automation.selected_clients

    print("Sending automation to these clients: {}".format(selected_clients) )

    # define constants
    EMERGENCY_MSG = "EMERGENCY ALERT FROM STATE FARM: "
    EMAIL_END_MSG = 'Reply "STOP ALL" to unsubscribe from all alerts or "STOP SOCIAL" to only recieve emergency alerts.'
    SMS_END_MSG = 'Reply "STOP" to unsubscribe from all alerts.'

    # correctly format selected clients array
    selected_clients = selected_clients.split(",")

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
        selected_client_info.append([client_index.name, client_index.email, str(client_index.phone), client_index.notification_status])

    # test code for making sure emails and phone numbers are correctly stored
    #print("Selected Emails: {}\n".format(selected_emails))
    #print("Selected Phones: {}\n".format(selected_phones))

    # if all fields are filled out...
    if( message_body != "" and message_subject != "" and message_priority != "def-select-opt" and message_type != "def-select-opt" ):
        # if "Send Email" is selected, then call the send_mail function with data
        if message_type == "email":
            for client_index in selected_client_info:
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    subject_temp = EMERGENCY_MSG + message_subject
                    message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                    + "\n\n" + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    subject_temp = "State Farm alert system - " + message_subject
                    message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # test code to make sure email is sent to the correct address
                #print("Sent to: {}\n".format(email_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)

        # if "Send SMS" is selected, then call the send_sms function with data
        elif message_type == "sms":
            for client_index in selected_client_info:
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                    "\n\n" + message_body + "\n\n" + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " \
                    + client_index[0] + "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # test code to make sure sms is sent to the correct number
                #print("Sent to: {}\n".format(sms_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)

        # if "Send Email and SMS" is selected, then call both functions with data
        else:
            for client_index in selected_client_info:
                # formatting for SMS
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency"  and client_index[3] != 'none':
                    message_temp = EMERGENCY_MSG + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] + \
                    "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    message_temp = "State Farm alert system - " + message_subject + "\n\n" + "State Farm alert for: " + client_index[0] \
                    + "\n\n" + message_body + "\n\n"  + SMS_END_MSG

                    # send the SMS message to the client
                    send_sms( message_temp, "+19087749012", client_index[2], fail_silently=False )

                # formatting for email
                # if the alert is marked as an emergency, format as such
                if message_priority == "send-emergency" and client_index[3] != 'none':
                    subject_temp = EMERGENCY_MSG + message_subject
                    message_temp = EMERGENCY_MSG + "\n\n" + "State Farm alert for: " + client_index[0] + "\n\n" + message_body \
                    + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # otherwise, format as a social alert
                elif client_index[3] != 'none' and client_index[3] != 'emergency':
                    subject_temp = "State Farm alert system - " + message_subject
                    message_temp = "State Farm alert for: " + client_index[0] + "\n\n" + message_body + "\n\n"  + EMAIL_END_MSG

                    # send the email to the client
                    send_mail(subject_temp, message_temp, "RedAlertTester@gmail.com", [client_index[1]])

                # test code to make sure email is sent to the correct address
                #print("Sent to: {}\n".format(email_index))

                # test code to make sure sms is sent to the correct number
                #print("Sent to: {}\n".format(sms_index))

            # send json response back
            response = {'Success': 'True'}
            return JsonResponse(response)


def saveSubset(request):

    saved_subset_objects = Subset.objects.filter(user_id=request.user.id)

    # Check that the user is not using a duplicate subset name, for database purposes
    for subset in saved_subset_objects:
        print(subset.name + " New Name: " + request.POST['subsetName'])
        if subset.name == request.POST['subsetName']:
            response = {'Success': 'duplicate'}
            return JsonResponse(response)


    newSubset = Subset()
    newSubset.name = request.POST['subsetName']
    newSubset.clientIDs = request.POST['subset']
    newSubset.user_id = request.user.id
    #newSubset.id = 1
    newSubset.save()

    response = {'Success': 'True'}
    return JsonResponse(response)


def deleteSchedJob( autoID, type ):

    if type == "many":
        type = "R" # If the automation is recurring
    else:
        type = "O" # If the automation is one time

    all_jobs = scheduler.get_jobs()

    print("Deleting sched job: All jobs currently scheduled: {}".format(all_jobs) )

    for job in all_jobs:
        if (type + str(autoID) ) == job.id: # Remove automated job if it exists.
            print("Job with id {} removed.".format(job.id))
            job.remove() # Remove the job if its id matches the id of the automation.

            print("Deleting sched job: Jobs Scheduled after deletion: {}".format(scheduler.get_jobs()) )


def refreshSchedJobsTest():

    all_jobs = scheduler.get_jobs()

    job_id_array = []



    print("All jobs currently scheduled: {}".format(all_jobs) )

    for job in all_jobs:
        job_id_array.append(job.id)

    print("Job ID array after creation: {}".format( job_id_array ))

    one_time_auto = OneTimeAutomation.objects.get(id=4)

    recurr_auto = RecurringAutomation.objects.get(id=6)

    # Shed the job for 8am on the date specified by user. # This one works!
    new_job = scheduler.add_job(send_auto_message, 'date',[one_time_auto.id, "one"], run_date=datetime.date(2022,3,18), id = str(one_time_auto.id) )

    #new_job = scheduler.add_job(send_auto_message, 'cron', [recurr_auto.id, "many"], hour="17", minute="00", start_date = datetime.date(2022, 3, 18), id = str(recurr_auto.id) ) # Executes the function monthly at 10am MST


    print("All jobs scheduled. Sheduled jobs: {}".format( scheduler.get_jobs() ) )

    # start the scheduler if its not already running.
    if scheduler.state != STATE_RUNNING:
        print("STARTING SCHEDULER")
        scheduler.start()


# Iterates through the one time automation objects and marks them inactive if their run date is greater than today
def markOneTimeAutosAsInactive():

    all_one_time_autos = OneTimeAutomation.objects.filter(active__in=[True])

    for automation in all_one_time_autos:
        print("AUTOMATION str {} COMPARISON {}".format(str(automation.date), automation.date < date.today()))

        if automation.date < date.today(): # The automation date is a datetime.date object which is created by date.today() where using datetime.now() returns a datetime.datetime object.
            print("setting auto active false")
            automation.active = False
            automation.save()


def save_user_search(request):
    new_search = SavedSearches()

    new_search.name = request.POST['name']
    new_search.query = request.POST['search']
    new_search.user_id = request.user.id

    new_search.save()

    response = {'Success':'true'}

    return JsonResponse(response)
