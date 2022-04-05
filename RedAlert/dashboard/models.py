from django.db import models

class Subset(models.Model):
    name = models.CharField( max_length=200 )

    # Client IDs of clients in the subset, saved as a string of integers seperated by spaces.
    clientIDs = models.CharField( max_length=2000 )

    # ID of the agent that the save subset belongs to.
    user_id = models.IntegerField()

class OneTimeAutomation( models.Model ):
    name = models.CharField( max_length = 200)
    date = models.DateField( auto_now= False )
    date_str = models.CharField( max_length = 200) # Date string makes date easy to display on front end. Formatted like this YYYY-MM-DD.
    msg_body = models.CharField( max_length = 1000)
    msg_sub = models.CharField( max_length = 200)
    msg_type = models.CharField( max_length = 200)
    msg_priority = models.CharField( max_length = 200)
    selected_clients = models.CharField( max_length = 500)
    active = models.BooleanField( default=True)
    user_id = models.IntegerField(default = 11) # the id of the auth user object. Defaults to calvins user id, change this to your id to make all automations belong to you.


class RecurringAutomation( models.Model ):
    name = models.CharField( max_length = 200)
    start_date = models.DateField( auto_now= False )
    start_date_str = models.CharField(max_length = 200)
    msg_body = models.CharField( max_length = 1000)
    msg_sub = models.CharField( max_length = 200)
    msg_type = models.CharField( max_length = 200)
    msg_priority = models.CharField( max_length = 200)
    selected_clients = models.CharField( max_length = 500)
    send_msg_freq = models.IntegerField(default= 1)
    send_msg_freq_unit = models.CharField( max_length = 200 )
    active = models.BooleanField( default=True)
    user_id = models.IntegerField(default = 11) # the id of the auth user object. Defaults to calvins user id, change this to your id to make all automations belong to you.

class SavedSearches( models.Model ):
    name = models.CharField( max_length = 800)
    query = models.CharField( max_length = 800)
    user_id =  models.IntegerField(default = 11)
    

