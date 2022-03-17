from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


app_name = 'user_pages_urls'
urlpatterns = [
    
    path('profile_page/', views.show_profile_page, name='show_profile_page' ),
    path('automation_page/', views.show_automations, name='automation_page'),
    path('update_automation/', views.update_automation, name='update_automation'),
    path('delete_automation/', views.delete_automation, name='delete_automation'),
    path('faq_page/', views.show_faq, name='faq_page'),
    path('update_user_profile/', views.update_user_profile, name='update_user_profile'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#print(include( 'dashboard.urls'))