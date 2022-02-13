from django.contrib import admin
from django.urls import path
from . import views


app_name = 'dashboard_urls'
urlpatterns = [
    # When user goes to localhost:8000/ run the landing_page view.
    path('', views.show_dashboard, name='dashboard_page' ),
    path('execute_search/', views.execute_search, name='execute_search'),

]