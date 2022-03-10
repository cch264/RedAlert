from django.db import models

# Create your models here.

class OneTimeAutomation( models.Model ):
    name = models.CharField( max_length = 200)
    date = models.DateField( auto_now= False )
    date_str = models.CharField( max_length = 200) 
    msg_body = models.CharField( max_length = 1000)
    msg_sub = models.CharField( max_length = 200)
    msg_type = models.CharField( max_length = 200)
    msg_priority = models.CharField( max_length = 200)
    selected_clients = models.CharField( max_length = 500)


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

