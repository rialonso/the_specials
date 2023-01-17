import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/core/services/translate/translate.service';

@Component({
  selector: 'app-register-step-header-info',
  templateUrl: './register-step-header-info.component.html',
  styleUrls: ['./register-step-header-info.component.scss']
})
export class RegisterStepHeaderInfoComponent implements OnInit {

  dataTexts;
  @Input() infos: string;
  constructor(
    private translateService: TranslateService,
  ) { 
    this.dataTexts = this.translateService?.textTranslate;
  }

  ngOnInit() {
  }


}
