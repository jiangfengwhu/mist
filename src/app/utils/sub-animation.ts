import {
  trigger,
  transition,
  query,
  style,
  animate,
  animateChild,
  group,
} from '@angular/animations';

export const slideAnimation = trigger('slideAnimation', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(':enter, :leave', [
      style({
        position: 'absolute',
        top: 0,
        left: 0,
        width: '100%'
      })
    ]),
    query(':enter', [
      style({ left: '-100%' })
    ]),
    query(':leave', animateChild(), {optional: true}),
    group([
      query(':leave', [
        animate('300ms ease-out', style({ left: '100%' }))
      ], {optional: true}),
      query(':enter', [
        animate('300ms ease-out', style({ left: '0%' }))
      ])
    ]),
    query(':enter', animateChild()),
  ]),
]);
