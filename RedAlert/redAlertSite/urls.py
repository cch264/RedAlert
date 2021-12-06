from django.contrib import admin
from django.urls import path
from . import views

# Defines a name space for our URLconf located in settings. Allows us to use url methods in templates, for dynamically generating
# urls based on paths defined here. We state that the url we want to generate in a template is located in the redAlertSite/urls.py file by
# using redAlertSite:path_name. See the templates/redAlertSite/index.html file for an example/
app_name = 'red_alert_site'
urlpatterns = [
    # When user goes to localhost:8000/ run the landing_page view.
    path('', views.landing_page, name='landing_page' ),
    path('admin/', admin.site.urls ),
    path('create_new_user/', views.create_new_user, name='create_new_user'),
    path('save_new_user/', views.save_new_user, name='save_new_user'),
]
