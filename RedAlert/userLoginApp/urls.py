from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views


app_name = 'loginAppUrls'
urlpatterns = [
    path('', views.userLoginPage, name='user_login_page' ),
    path('<int:loginSuccess>', views.userLoginPage, name='user_login_page' ),
    path('newAccount/<int:newAccountSuccess>', views.userLoginPage, name='new_user_account_success' ),
    path('change_pass_login/<str:pass_change>', views.userLoginPage, name='login_after_pass_change' ),
    path('logout/<int:loggedOut>', views.userLoginPage, name='log_user_out' ),
    path('log_in_success', views.loginSuccess, name="login_success" ),
    path('auth_user_login', views.authenticateUserLogin, name='auth_user_login'),
    path('create_new_user', views.createNewUserForm, name='create_new_user'),
    path('save_new_user', views.saveNewUser, name='save_new_user'),
    path('new_user_success', views.newUserSuccess, name='new_user_success'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

