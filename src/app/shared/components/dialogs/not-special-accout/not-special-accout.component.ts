import { Component, OnInit } from '@angular/core';
import { TranslateService } from 'src/app/core/services/translate/translate.service';

@Component({
  selector: 'app-not-special-accout',
  templateUrl: './not-special-accout.component.html',
  styleUrls: ['./not-special-accout.component.scss']
})
export class NotSpecialAccoutComponent implements OnInit {
  dataTexts;

  constructor(
    private translateService: TranslateService,
  ) {
    this.dataTexts = this.translateService?.textTranslate;
   }

  ngOnInit(): void {
  }

}
