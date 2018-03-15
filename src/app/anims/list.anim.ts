import {
  trigger,
  stagger,
  transition,
  style,
  animate,
  query
} from '@angular/animations'

export const listAnimation = trigger('listAnim', [
  transition('* => *', [
    query(':enter', [
      style({ opacity: 0 }),
      stagger(100, [
        animate('0.5s', style({ opacity: 1 }))
      ])
    ], { optional: true }),
    query(':leave', [
      style({ opacity: 1 }),
      stagger(100, [
        animate('0.5s', style({ opacity: 0 }))
      ])
    ], { optional: true })
  ])
])