import sched
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
from .models import OneTimeAutomation
from .models import RecurringAutomation

from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.schedulers.base import STATE_STOPPED, STATE_RUNNING, STATE_PAUSED





# Initialize the background schedular
scheduler = BackgroundScheduler()
schedulerInitialStart = True

# Create your views here.
# Do not show the dashboard if the user isnt logged in!
# login_url is the urls to redirect a user to if they are not logged in!
@login_required( login_url='/')
def show_dashboard( request ):

    # Dont run this functin when the dashboar loads if the scheduler is already running.
    # This is how we start the schedular on server restart. Not the best solution but it works fine for now.
    if scheduler.state != STATE_RUNNING:
        refreshSchedJobs()
        print("Initiliazing shed jobs for first time.")
    else:
        print("Not Initiliazing Jobs for first time. Printing Sheduled Jobs: {}".format(scheduler.get_jobs()) )

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
        a_client_dict["lat"] = client.lat
        a_client_dict["long"] = client.long


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
        a_client.birthdate = datetime.date(random.randint(1920, 2005),random.randint(1, 12), random.randint(1, 28) )
        a_client.age = 2022 - a_client.birthdate.year
        a_client.gender = gender[ random.randint(0,1)]
        a_client.notification_status = notification_status[random.randint(0, len(notification_status) - 1)]
        a_client.lat = longLat[index][0]
        a_client.long = longLat[index][1]
        a_client.email = emails[random.randint(0, len(emails) - 1 )]
        a_client.phone = phones[random.randint(0, len(phones) - 1 )]
        #a_client.email = a_client.name.split(' ')[0] + emails[random.randint(0, len(emails) - 1 )]
        #a_client.email = "npn24@nau.edu"
        #a_client.email = "cch264@nau.edu"
        #a_client.phone = "13096202335"

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
        selected_client_info.append([client_index.name, client_index.email, str(client_index.phone)])

    # test code for making sure emails and phone numbers are correctly stored
    #print("Selected Emails: {}\n".format(selected_emails))
    #print("Selected Phones: {}\n".format(selected_phones))

    # if "Send Email" is selected, then call the send_mail function with data
    if message_type == "email":
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
    elif message_type == "sms":
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


# Function that takes an ajax request and creates an automation.
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
        newOneTimeAuto.save()


    # call this after each automation is added to create a sheduled job.
    refreshSchedJobs()

    return JsonResponse(response)


# Iterates through the automation collections and either creates new scheduled jobs from automations that havent been shceduled or reshedules jobs that may have been lost due to system restart.
# Called on system load and when a new automation is added or edited.
def refreshSchedJobs( ):


    all_jobs = scheduler.get_jobs()

    job_id_array = []

    all_one_time_autos = OneTimeAutomation.objects.all()

    all_recurr_autos = RecurringAutomation.objects.all()

    print("All one time ids {}::: All recurring ids {}".format(all_one_time_autos, all_recurr_autos) )

    print("All jobs currently scheduled: {}".format(all_jobs) )

    for job in all_jobs:
        job_id_array.append(job.id)

    print("Job ID array after creation: {}".format( job_id_array ))

    for one_time_auto in all_one_time_autos:
        if ("O" + str(one_time_auto.id) ) not in job_id_array:
            print("Creating new one time automation shed. ID: {}::: Date obj is {}".format( one_time_auto.id, one_time_auto.date ))

            auto_year = one_time_auto.date_str[0:4]
            auto_month = one_time_auto.date_str[5:7]
            auto_day = one_time_auto.date_str[8:10]

            # Shed the job for 8am on the date specified by user. Sends the notifications at 17 UTC, which is 10am MST.
            new_job = scheduler.add_job(send_auto_message, 'date',[one_time_auto.id, "one"], run_date = datetime.datetime( int(auto_year), int(auto_month), int(auto_day), 17, 0), id = "O" + str(one_time_auto.id),name=one_time_auto.name )
        else:
            print("One time auto already has a scheduled job, skipping...")

    for recurr_auto in all_recurr_autos:
        if ("R" + str(recurr_auto.id) ) not in job_id_array:
            print("Creating recurring automation shed. ID: {}::: Date str is {}".format( recurr_auto.id, recurr_auto.start_date_str ))

            auto_unit = recurr_auto.send_msg_freq_unit

            if auto_unit == "month":
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
    else:
        automation = RecurringAutomation.objects.get(id=autoID)

    # define variables
    message_subject = automation.msg_sub
    message_body = automation.msg_body
    message_type = automation.msg_type
    message_priority = automation.msg_priority
    selected_clients = automation.selected_clients

    print("Sending automation to these clients: {}".format(selected_clients) )

    # define constants
    EMERGENCY_MSG = "EMERGENCY ALERT FROM STATE FARM: "
    END_MSG = "Do not reply to this alert"

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
        selected_client_info.append([client_index.name, client_index.email, str(client_index.phone)])

    # test code for making sure emails and phone numbers are correctly stored
    #print("Selected Emails: {}\n".format(selected_emails))
    #print("Selected Phones: {}\n".format(selected_phones))

    # if "Send Email" is selected, then call the send_mail function with data
    if message_type == "email":
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
    elif message_type == "sms":
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
