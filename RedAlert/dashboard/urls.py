from django.contrib import admin
from django.urls import path
from . import views


app_name = 'dashboard_urls'
urlpatterns = [
    # When user goes to localhost:8000/ run the landing_page view.
    path('', views.show_dashboard, name='dashboard_page' ),
    path('execute_search/', views.execute_search, name='execute_search'),
    path('send_message/', views.send_message, name='send_message'),
<<<<<<< HEAD
    path('save_subset/', views.saveSubset, name='save_subset'),
=======
    path('save_automation/', views.save_automation, name='send_automation'),
>>>>>>> main
]
