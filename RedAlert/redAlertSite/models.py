from django.db import models

    # We are using MongoDB BUT we are interacting with our mongo db database as if
    # It were a relational database because we are using Djongo! This is so we dont have to do any roundabout stuff
    # To do things that are built into Django.
class Client( models.Model ):
    name = models.CharField( max_length=200 )
    email = models.IntegerField()
    age = models.IntegerField()

    def __str__(self):
        return self.name
