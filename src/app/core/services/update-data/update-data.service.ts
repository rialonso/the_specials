import { HttpService } from './../generics-http/httpService.service';
import { Injectable } from '@angular/core';
import { ISignIn } from 'src/app/shared/model/sign-in/sign-in.state';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { State, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state-management/app.model';
import { IUserData } from 'src/app/state-management/user-data/user-data.state';

@Injectable({
  providedIn: 'root'
})
export class UpdateDataService extends HttpService<any>{
  constructor(
    httpClient: HttpClient,

    ) {
    super(
      httpClient,
      environment.api,
      environment.urls.updateUser,
      new UpdateDataSerializer());
  }
}
class UpdateDataSerializer {
  constructor (
    private store?: Store<IAppState>,
    private state?: State<IAppState>
    ) {}
  fromJson(signInData: IUserData.RootObject | any): any {
    if(signInData != undefined ) {
      return signInData;
    }

  }

  toJson(signInData: ISignIn): any {
    return signInData;
  }
}
