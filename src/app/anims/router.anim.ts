import { trigger, state, transition, style, animate, keyframes, group } from '@angular/animations'

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
    style({'transform': 'translateX(-100%)', opacity: 0}),
    group([
      animate('300ms ease-in-out', style({'transform': 'translateX(0)'})),
      animate('300ms ease-in', style({opacity: 1}))
    ])
  ]),
  transition(':leave', [
    style({'transform': 'translateX(0)', opacity: 1}),
    group([
      animate('300ms ease-in-out', style({'transform': 'translateX(100%)'})),
      animate('300ms ease-in', style({opacity: 0}))
    ])
  ]),
])