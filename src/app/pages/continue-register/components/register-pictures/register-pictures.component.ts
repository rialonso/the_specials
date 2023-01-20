import { Component, OnInit } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ProfilePicturesService } from 'src/app/core/services/profile-pictures/profile-pictures.service';
import { TranslateService } from 'src/app/core/services/translate/translate.service';
import { EnumRoutesApplication } from 'src/app/shared/enum/routes.enum';
import { RouteService } from 'src/app/shared/functions/routes/route.service';
import { IAppState } from 'src/app/state-management/app.model';
import { environment } from 'src/environments/environment';
import { ImagesTypes } from '../register-data/enum/images-type.enum';

@Component({
  selector: 'app-register-pictures',
  templateUrl: './register-pictures.component.html',
  styleUrls: ['./register-pictures.component.scss']
})
export class RegisterPicturesComponent implements OnInit {
  headerInfos: string;

  imagesTypes = ImagesTypes;
  enumRoutesApplication = EnumRoutesApplication
  imagesList = [];
  loading = false;

  dataTexts;
  imagesURL;

  constructor(
    protected store: Store,
    protected state: State<IAppState>,
    private translateService: TranslateService,
    private profilePicturesService: ProfilePicturesService,
    private routeService: RouteService,

  ) { 
    this.dataTexts = this.translateService?.textTranslate;
    this.headerInfos = this.dataTexts.registerPg.text

  }

  ngOnInit() {
    this.setDataInFormWheDataRecovered();
  }

  selectedImage(files: File, imageType: ImagesTypes) {
    // const controlPictures = this.formGroup.get('profile_picture');
    if (files && files[0]) {
      // (controlPictures as FormArray).push(this.formBuilder.group(files[0]));
      const reader = new FileReader();
      reader.readAsDataURL(files[0]);
      reader.onload = (evt) => {
        switch (imageType) {
          case ImagesTypes.FIRST_IMAGE:
            this.addImagesURL(ImagesTypes.FIRST_IMAGE, evt.target.result);
            this.imagesList[0] = files[0];
            break;
          case ImagesTypes.SECOND_IMAGE:
            this.addImagesURL(ImagesTypes.SECOND_IMAGE, evt.target.result);
            this.imagesList[1] = files[0];
            break;
          case ImagesTypes.THIRD_IMAGE:
            this.addImagesURL(ImagesTypes.THIRD_IMAGE, evt.target.result);
            this.imagesList[2] = files[0];
            break;
          case ImagesTypes.FORTY_IMAGE:
            this.addImagesURL(ImagesTypes.FORTY_IMAGE, evt.target.result);
            this.imagesList[3] = files[0];
            break;
          default:
            break;
        }
      };
    }
  }
  addImagesURL(key, value) {
    this.imagesURL = {
      ...this.imagesURL,
      [key]: value
    }
  }
  async continueRegister() {
    this.loading = true;
    if(this.imagesList.length > 0) {
      await this.profilePicturesService.post(this.setFormDataToSendFiles()).toPromise();
    }
    this.loading = false;
    this.navigateTo(this.enumRoutesApplication.REGISTER_USER_DATA)
  }
  navigateTo(route: EnumRoutesApplication) {
    this.routeService.navigateToURL(route);

  }
  setFormDataToSendFiles() {
    const formData = new FormData();
    for (let i = 0; i < this.imagesList.length; i++) {
      formData.append('image[]', this.imagesList[i]);
    }
    return formData;
  }
  setDataInFormWheDataRecovered() {
    const registerData = this.state.getValue()?.registerData
    if (registerData.profile_picture !== null) {
      if (registerData?.profile_picture[0]) {
        this.imagesURL = {
          ...this.imagesURL,
          [this.imagesTypes.FIRST_IMAGE]: `${environment.urlImages}${registerData?.profile_picture[0]?.path}`
        }
      } else {
        this.imagesURL = {
          ...this.imagesURL,
        }
      }
    }
  }
}

