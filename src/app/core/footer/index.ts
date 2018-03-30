import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-footer',
  template: `
    <md-toolbar color="primary">
      <span class="fill-remaining-space"></span>
      <span>底部</span>
      <span class="fill-remaining-space"></span>
    </md-toolbar>
  `,
  styles: [`
  `],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterComponent { }
