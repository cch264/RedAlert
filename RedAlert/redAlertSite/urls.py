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
    # you can have multiple urls for the same path. In this case we want to go to the landing page but we want to pass in a success
    # value so we know the user just logged in.
    path('<int:login_success>', views.landing_page, name='landing_page' ),
    path('log_in_success', views.landing_page, name="landing_page_2"),
    path('admin/', admin.site.urls ),
    path('create_new_user/', views.create_new_user, name='create_new_user'),
    path('save_new_user/', views.save_new_user, name='save_new_user'),
    path('send_email/', views.send_email, name='send_email'),
    path('log_in/', views.user_log_in, name='log_in_user'),
    path('auth_new_user/', views.auth_user_login, name='auth_user_login'),
    path('search_clients/', views.search_clients, name='search_clients'),
    path('execute_search/', views.execute_search, name='execute_search'),
    path('send_sms/', views.send_sms_message, name='send_sms_message'),

]
