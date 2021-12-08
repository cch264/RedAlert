from django.db import models

# We are using MongoDB BUT we are interacting with our mongo db database as if
# It were a relational database! This is so we dont have to do any roundabout stuff
# To do things that are built into Django.

   class ClientData(models.Model):
    client_ID = models.IntegerField()
    client_Name = models.CharField(max_length=70)
    client_Email = models.EmailField(max_length=70)