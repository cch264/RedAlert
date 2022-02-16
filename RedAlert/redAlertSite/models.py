from django.db import models

    # We are using MongoDB BUT we are interacting with our mongo db database as if
    # It were a relational database because we are using Djongo! This is so we dont have to do any roundabout stuff
    # To do things that are built into Django.
class Client( models.Model ):
    name = models.CharField( max_length=200 )
    unit_num = models.IntegerField()
    street = models.CharField( max_length=200 )
    city = models.CharField( max_length=200 )
    zip_code = models.IntegerField()
    state = models.CharField( max_length=200 )
    license_num = models.CharField( max_length=200 )
    policies = models.CharField( max_length=200 )
    age = models.IntegerField()
    # Dont automatically assign the current date to this field apon user creation.
    birthdate = models.DateField( auto_now= False )
    gender = models.CharField( max_length=5 )
    notification_status = models.CharField( max_length=200 )
    email = models.CharField( max_length=200 )
    # Added my number as default for now for testing. Change this number and makemigrations to change to a diff number.
    phone = models.IntegerField( default=43803690030 )

    def __str__(self):
        return self.name
