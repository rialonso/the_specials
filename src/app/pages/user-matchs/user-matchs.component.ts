import { AfterViewInit, Component, ElementRef, OnInit, QueryList, ViewChild } from '@angular/core';
import { State, Store } from '@ngrx/store';
import { ReplaySubject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { GetSugestionMatchsService } from 'src/app/core/services/get-sugestion-matchs/get-sugestion-matchs.service';
import { LikeDislikeService } from 'src/app/core/services/like-dislike/like-dislike.service';
import { TranslateService } from 'src/app/core/services/translate/translate.service';
import { EnumLikeDislikeActions } from 'src/app/shared/enum/like-dislike/likes-dislike.enum';
import { EnumRoutesApplication } from 'src/app/shared/enum/routes.enum';
import { DialogsService } from 'src/app/shared/functions/dialogs/dialogs.service';
import { StateManagementFuncService } from 'src/app/shared/functions/state-management/state-management-func.service';
import { ModelLikeDislikeRequest } from 'src/app/shared/model/request/like-dislike-request/like-dislike.model';
import { IAppState } from 'src/app/state-management/app.model';
import { IControlsApp } from 'src/app/state-management/controls/controls-app.state';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-user-matchs',
  templateUrl: './user-matchs.component.html',
  styleUrls: ['./user-matchs.component.scss']
})
export class UserMatchsComponent implements OnInit, AfterViewInit {
  enumLikeDislikeAction = EnumLikeDislikeActions;
  enumRoutesApplication = EnumRoutesApplication
  dataTexts;

  active = false;
  loading = false;
  showAds = false;
  liked = false;
  disliked = false;

  matchUser;
  allSugestionMatchs;
  currentX;
  currentY;
  initialX;
  initialY;
  likePosition;
  deslikePosition;
  xOffset: number = 0;
  yOffset: number = 0;

  countMatchsSlided = 0;

  destroy$ = new ReplaySubject();
  constructor(
    protected state: State<IAppState>,
    protected store: Store,
    private likeDislikeService: LikeDislikeService,
    private getSugestionMatchsService: GetSugestionMatchsService,
    private translateService: TranslateService,
    private dialogsService: DialogsService,
    private stateManagementFuncService: StateManagementFuncService,
  ) {


  }

  ngOnInit() {
    this.getSugestionMatchs();
    this.execDragSplitSugestions();
    this.subscribeCountsAds();

  }
  ngAfterViewInit() {
    setTimeout(() => {
    try {
        (window["adsbygoogle"] = window["adsbygoogle"] || []).push({});
      } catch (e) {
        console.error(e);
      }
    }, 2000);
  }
  subscribeCountsAds() {
    this.store
    .select((state: IAppState) => state.controlsApp.countShowAds)
    .pipe(takeUntil(this.destroy$))
    .subscribe(state => {
      console.log(state);

      if (state === 10) {
        this.buttonDisabled('add')
        this.showAds = true;

      } else {
        this.showAds = false;
      }
    })
  }
  async getSugestionMatchs() {
    this.loading = true;
    this.dataTexts = this.translateService?.textTranslate;
    const sugestionMatchs = await this.getSugestionMatchsService.get().toPromise();
    this.matchUser = sugestionMatchs?.data?.slice(0, 3);
    this.allSugestionMatchs = sugestionMatchs.data;
    this.loading = false;
    this.dragCard();

  }
  dragCard(): void {
    const container = document.querySelector('#container-drag');
    container?.addEventListener('touchstart', this.dragStart, false);
    container?.addEventListener('touchend', this.dragEnd, false);
    container?.addEventListener('touchmove', this.drag, false);

    container?.addEventListener('mousedown', this.dragStart, false);
    container?.addEventListener('mouseup', this.dragEnd, false);
    container?.addEventListener('mousemove', this.drag, false);
    // elm.style.transform = `translate3d(${pos1}px, ${pos2}px, 20px)`;
  }
  async likeUnlikeMatch( action: string) {
    const data = new ModelLikeDislikeRequest(
      this.matchUser[0]?.id,
      action
    )
    const a = await this.likeDislikeService.post(data).toPromise();
    const sugestionMatchs = await this.getSugestionMatchsService.get().toPromise();
    this.matchUser = sugestionMatchs?.data?.slice(0, 3);
  }
  async execDragSplitSugestions() {
    if (document.querySelectorAll('.ads')[0] === undefined) {
      const dragItemInterval = setInterval(() => {
        const dragItem: any = document.querySelectorAll('.sugestion-match')[0];
        const dragDataPosition: any = dragItem?.getAttribute('data-position');
        dragDataPosition === '150' ? this.countShowAdsAndExecLikeDislike(this.enumLikeDislikeAction.LIKE) : dragItem?.setAttribute('data-position', 0 );
        dragDataPosition === '-150' ? this.countShowAdsAndExecLikeDislike(this.enumLikeDislikeAction.UNLIKE) :  dragItem?.setAttribute('data-position', 0 );
      }, 1000);
      setTimeout(() => {
        clearInterval(dragItemInterval);
      }, 1500);
    } else {
      const dragItem: any = document.querySelectorAll('.sugestion-match')[0];
      const dragDataPosition: any = dragItem?.getAttribute('data-position');
      dragDataPosition === '150' ? this.resetCountEnableButtons() : dragItem?.setAttribute('data-position', 0 );
      dragDataPosition === '-150' ? this.resetCountEnableButtons() :  dragItem?.setAttribute('data-position', 0 );
    }
  }
  resetCountEnableButtons() {
    this.buttonDisabled('remove');
    this.stateManagementFuncService.resetCountShowAdsense();
  }
  countShowAdsAndExecLikeDislike(likeOrDislike) {
    this.likeUnlikeMatch(likeOrDislike);
    this.stateManagementFuncService.incrementCountShowAdsense();
  }
  dragExecLikeAddMore(): any {
    this.likeUnlikeMatch(this.enumLikeDislikeAction.LIKE);
  }
  dragExecDislikeAddMore(): any {
    this.likeUnlikeMatch(this.enumLikeDislikeAction.UNLIKE);
  }
  drag(e): void {
    if (this.active) {
      const dragItem: any = document.querySelectorAll('.sugestion-match')[0];
      const buttons = document.querySelectorAll('.container-buttons-action');
      e.preventDefault();
      if (e.type === 'touchmove') {
        this.currentX = e.touches[0].clientX - this.initialX;
        this.currentY = e.touches[0].clientY - this.initialY;
      } else {
        this.currentX = e.clientX - this.initialX;
        this.currentY = e.clientY - this.initialY;
      }

      if (this.currentX >= 140 && this.currentX <= 150){
        dragItem.setAttribute('data-position', 150 );
        dragItem.classList.add('like-animation');
        buttons.forEach((value) => {value.setAttribute('disabled', 'true'); });
      }
      if (this.currentX <= -150 && this.currentX >= -160) {
        dragItem.setAttribute('data-position', -150 );
        dragItem.classList.add('dislike-animation');
        buttons.forEach((value) => {value.removeAttribute('disabled'); });

      }
      this.xOffset = this.currentX;
      this.yOffset = this.currentY;
      dragItem.style.transform = `rotate(${this.currentX / 10}deg) translate3d(${this.currentX}px, ${ this.currentY}px, 0)`;

    }
  }
  dragStart(e): void {
    const dragItem: any = document.querySelectorAll('.sugestion-match')[0];
    const imgDragItem: any = document.querySelectorAll('.container-sugestion-perfil')[0];
    const nameProfileDrag: any = document.querySelectorAll('.profile-img')[0];
    if (e.type === 'touchstart') {
      this.initialX = e.touches[0].clientX;
      this.initialY = e.touches[0].clientY;
    } else {
      this.initialX = e.clientX;
      this.initialY = e.clientY;
    }
    if (e.target === dragItem || e.target === imgDragItem || e.target === nameProfileDrag ) {
      this.active = true;
    }
  }
  dragEnd(e): any {
    const dragItem: any = document.querySelectorAll('.sugestion-match')[0];
    this.initialX =  this.initialX - this.currentX;
    this.initialY =  this.initialY - this.currentY;
    dragItem.style.transform = `translate3d(0px, 0px, 0)`;
    this.active = false;
  }
  addClassAnimation(likeOrDeslike): void {
    const addAnimation: any = document.querySelectorAll('.sugestion-match')[0];
    likeOrDeslike === 'like' ?
      addAnimation.classList.add('like-animation') :
      addAnimation.classList.add('dislike-animation');
  }
  transitionOptionMatch(likeOrDeslike): Promise<boolean>{
    return new Promise((resolve: any, reject: any) => {
      this.addClassAnimation(likeOrDeslike);
      this.buttonDisabled('add');
      setInterval(() => {
        resolve(true);
      }, 1000);
    });
  }
  buttonDisabled(addOrRemove): void {
    const buttons = document.querySelectorAll('.container-buttons-action');
    addOrRemove === 'add' ?
      buttons.forEach((value) => {value.setAttribute('disabled', 'true'); }) :
      buttons.forEach((value) => {value.removeAttribute('disabled'); });
  }
  clickAddMoreMatchAndTransition(likeOrDeslike): void {
    this.transitionOptionMatch(likeOrDeslike).then((res: boolean) => {
      if (res) {
        likeOrDeslike === this.enumLikeDislikeAction.LIKE ? this.countShowAdsAndExecLikeDislike(this.enumLikeDislikeAction.LIKE) : '';
        likeOrDeslike === this.enumLikeDislikeAction.UNLIKE ? this.countShowAdsAndExecLikeDislike(this.enumLikeDislikeAction.UNLIKE) : '';
        this.buttonDisabled('remove');
        // this.addMoreMatch();
      }
    });
  }
  changeUserImageInBackground(profilePicture): string {
    return `background-image: url(${environment.urlImages}${profilePicture[0]?.path}); background-color: #D9D9D9;`;
  }
  transformAge(birthdateUser) {
    const birthdate = birthdateUser.replace(/-/g, '')
    const year = Number(birthdate.substr(0, 4));
    const today = new Date();
    const month = Number(birthdate.substr(4, 2)) - 1;
    const day = Number(birthdate.substr(6, 2));
    let age = today.getFullYear() - year;
    if (today.getMonth() < month || (today.getMonth() == month && today.getDate() < day)) {
      age--;
    }
    return age;
  }
  getDistance(distanceFull: number) {
    return Math.trunc(distanceFull);
  }
  viewProfile(id) {
    this.dialogsService.openProfile(id);
  }
}
