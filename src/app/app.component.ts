import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { TranslateService } from './core/services/translate/translate.service';
import { UserProfileService } from './core/services/user-profile/user-profile.service';
import { DialogsService } from './shared/functions/dialogs/dialogs.service';
import { IAppState } from './state-management/app.model';
import { AddAllDataUser } from './state-management/user-data/user-data.action';
import { IUserData } from './state-management/user-data/user-data.state';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'web-devotee';

  loading = false;
  constructor(
    protected state: State<IAppState>,
    protected store: Store<IAppState>,
    private translateService: TranslateService,
    private userProfileService: UserProfileService,
    private dialogsService: DialogsService,
    ) {}
  ngOnInit(): void {
    this.translateService.veriyLanguage();
    this.getUserWithoutData();
  }
  async getUserWithoutData() {
    if (localStorage.getItem('userId') ) {
      this.loading = true;
      const userId = parseInt(localStorage.getItem('userId'));
      const dataUser: IUserData.RootObject = await this.userProfileService.get(userId).toPromise();
   
      this.store.dispatch(new AddAllDataUser(dataUser));
      if(!dataUser.data.lat || !dataUser.data.lng) {
        this.openModalActivateLocation();
      }
      this.loading = false;
    }
  }
  openModalActivateLocation() {
    // if (!this.state.getValue()?.registerData.lat
    //   && !this.state.getValue()?.registerData.lng) {
      this.dialogsService
      .openActivateLocation()
      .afterClosed()
      .subscribe( c => {
        
      });
    // }

  }
}
