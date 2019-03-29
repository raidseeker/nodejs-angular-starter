import { Component, PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import {
  Router,
  Event as RouterEvent,
  NavigationStart,
  NavigationEnd,
  NavigationCancel,
  NavigationError
} from '@angular/router';
import { LoadingBarService } from '@ngx-loading-bar/core';

import { isPlatformBrowser } from '@angular/common';

import { AppService } from '@services';

declare var jQuery: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  constructor(
    private router: Router,
    private loadingBarService: LoadingBarService,
    public appService: AppService,
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string
  ) {
    if (isPlatformBrowser(platformId))
      this.router.events.subscribe(this.navigationInterceptor.bind(this));
  }

  private isAppLoading = false;

  get isLoading() {
    return this.isAppLoading;
  }
  set isLoading(newValue) {
    if (newValue) {
      this.loadingBarService.start();
    } else {
      this.loadingBarService.complete();
    }

    this.isAppLoading = newValue;
  }

  navigationInterceptor(event: RouterEvent): void {
    if (event instanceof NavigationStart) {
      this.isLoading = true;

      // Toogle navbar collapse when clicking on link
      const navbarCollapse = jQuery('.navbar-collapse');
      if (navbarCollapse != null) {
        navbarCollapse.collapse('hide');
      }
    }
    if (event instanceof NavigationEnd) {
      this.isLoading = false;
    }

    // Set loading state to false in both of the below events to hide the spinner in case a request fails
    if (event instanceof NavigationCancel) {
      this.isLoading = false;
    }
    if (event instanceof NavigationError) {
      this.isLoading = false;
    }
  }
}
