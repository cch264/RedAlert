from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


app_name = 'user_pages_urls'
urlpatterns = [
    
    path('profile_page/', views.show_profile_page, name='show_profile_page' ),
    path('automation_page/', views.show_automations, name='automation_page'),
    path('faq_page/', views.show_faq, name='faq_page'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#print(include( 'dashboard.urls'))