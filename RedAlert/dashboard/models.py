from django.db import models

# Create your models here.
class SavedSubset(models.Model):
  name = models.CharField( max_length=200 )

  # Client IDs of clients in the subset, saved as a string of integers seperated by spaces.
  clientIDs = models.CharField( max_length=2000 )

  # ID of the agent that the save subset belongs to.
  user_id = models.IntegerField()

