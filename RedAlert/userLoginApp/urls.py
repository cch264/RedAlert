from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


app_name = 'loginAppUrls'
urlpatterns = [
    
    path('', views.userLoginPage, name='user_login_page' ),
    path('log_in_success', views.loginSuccess, name="login_success" ),
    path('auth_user_login', views.authenticateUserLogin, name='auth_user_login'),
    path('create_new_user', views.createNewUserForm, name='create_new_user'),
    path('save_new_user', views.saveNewUser, name='save_new_user'),
    path('new_user_success', views.newUserSuccess, name='new_user_success'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

#print(include( 'dashboard.urls'))