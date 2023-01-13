import { HttpService } from './../generics-http/httpService.service';
import { Injectable } from '@angular/core';
import { ISignIn } from 'src/app/shared/model/sign-in/sign-in.state';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { State, Store } from '@ngrx/store';
import { IUserData } from 'src/app/state-management/user-data/user-data.state';
import { IRegisterUser } from 'src/app/state-management/register/register.state';
import { VerifyEmail } from 'src/app/shared/model/verify-email/verify-email.model';

@Injectable({
  providedIn: 'root'
})
export class VerifyEmailService extends HttpService<any>{
  constructor(
    httpClient: HttpClient,

    ) {
    super(
      httpClient,
      environment.api,
      environment.urls.registerUser,
      new RegisterUserSerializer());
  }
}
class RegisterUserSerializer {
  constructor () {}
  fromJson(registerRequest: string): string {
    if(registerRequest != undefined ) {
      return registerRequest;
    }

  }

  toJson(registerResponse: VerifyEmail.Response): VerifyEmail.Response {
    return registerResponse;
  }
}
