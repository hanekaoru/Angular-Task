import { trigger, state, transition, style, animate, keyframes } from '@angular/animations'

export const slideToRight = trigger('routeAnim', [
  state('void', style({
    'position': 'fixed',
    'width': '100%',
    'height': '80%'
  })),
  state('*', style({
    'position': 'fixed',
    'width': '100%',
    'height': '100%'
  })),
  transition(':enter', [
    style({'transform': 'translateX(-100%)'}),
    animate('300ms ease-in-out', style({'transform': 'translateX(0)'}))
  ]),
  transition(':leave', [
    style({'transform': 'translateX(0)'}),
    animate('300ms ease-in-out', style({'transform': 'translateX(100%)'}))
  ]),
])