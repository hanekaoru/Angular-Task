import { Component } from '@angular/core';
import { OverlayContainer } from '@angular/material';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  constructor(private oc: OverlayContainer) {

  }

  public darkTheme = false;

  switchTheme(dark) {
    this.darkTheme = dark;
    this.oc.themeClass = dark ? 'my-dark-theme' : null;
  }
}
