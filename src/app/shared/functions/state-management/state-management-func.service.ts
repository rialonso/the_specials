import { Injectable } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { IAppState } from 'src/app/state-management/app.model';
import { ResetCountShowAds, IncrementCountShowAds } from 'src/app/state-management/controls/copntrols-app.action';
import { AddDataRegister } from 'src/app/state-management/register/register.action';
import { AddAllDataUser } from 'src/app/state-management/user-data/user-data.action';
import { IUserData } from 'src/app/state-management/user-data/user-data.state';

@Injectable({
  providedIn: 'root'
})
export class StateManagementFuncService {

constructor(
  protected store: Store<IAppState>,
  protected state: State<IAppState>,
) { }
  funcAddAllDataUser(dataUser: any): boolean {
    this.store.dispatch(new AddAllDataUser(dataUser));
    return true;
  }
  funcAddDataRegister(payload: any): boolean {
    this.store.dispatch(new AddDataRegister(payload));
    return true;
  }
  incrementCountShowAdsense() {
    this.store.dispatch(new IncrementCountShowAds());
    return true;
  }
  resetCountShowAdsense() {
    this.store.dispatch(new ResetCountShowAds());
    return true;
  }
}
