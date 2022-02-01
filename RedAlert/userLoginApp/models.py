from django.db import models

# Create your models here.

# Define an agent collection. This stores personal information about an agent
class UserInfo( models.Model ):
    first_name = models.CharField( max_length = 200 )
    last_name = models.CharField( max_length = 200 ) 
    email = models.CharField( max_length = 200)
    birthdate = models.DateField( auto_now= False )
    agency_name = models.CharField( max_length = 200 )
    agent_code = models.IntegerField()
    agent_phone_number = models.IntegerField()
    agent_address = models.CharField( max_length = 200 )
    # This is the id of the user object! Not this object but a seperate object model created by django which we actually use for authentication.
    user_id = models.IntegerField()
    account_creation_date = models.DateField( auto_now = True )

    def __str__(self):
        return self.name
