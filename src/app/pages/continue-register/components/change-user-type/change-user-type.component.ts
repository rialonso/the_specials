import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { State, Store } from '@ngrx/store';
import { TranslateService } from 'src/app/core/services/translate/translate.service';
import { UpdateDataService } from 'src/app/core/services/update-data/update-data.service';
import { EnumRoutesApplication } from 'src/app/shared/enum/routes.enum';
import { EnumUserType } from 'src/app/shared/enum/user-types/user-type.enum';
import { RouteService } from 'src/app/shared/functions/routes/route.service';
import { IAppState } from 'src/app/state-management/app.model';
import { AddDataRegister } from 'src/app/state-management/register/register.action';

@Component({
  selector: 'app-change-user-type',
  templateUrl: './change-user-type.component.html',
  styleUrls: ['./change-user-type.component.scss']
})
export class ChangeUserTypeComponent implements OnInit {
  dataTexts;

  enumUserType = EnumUserType;
  enumRouteApp = EnumRoutesApplication;
  userTypeChanged: EnumUserType;

  formGroup: FormGroup;
  constructor(
    protected store: Store<IAppState>,
    protected state: State<IAppState>,
    private translateService: TranslateService,
    private formBuilder: FormBuilder,
    private routeService: RouteService,
    private router: Router,
    private updateDataService: UpdateDataService,
  ) {
    this.dataTexts = this.translateService?.textTranslate;
   }

  ngOnInit() {
    this.initForm();
  }
  initForm() {
    this.formGroup = this.formBuilder.group({
      account_type: [
        '',
        [
          Validators.required,
        ]
      ]
    })
  }
  changeUserType(userType: EnumUserType) {
    this.userTypeChanged = userType;
    this.store.dispatch(new AddDataRegister(this.formGroup.value));
  }
  async navigateTo(route: EnumRoutesApplication) {
    await this.updateDataService.post(this.formGroup.value, this.state.getValue().userData.data.id).toPromise();
    this.routeService.navigateToURL(route);
  }
}
