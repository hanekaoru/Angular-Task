import { Component, OnInit, Input, Output, EventEmitter, HostListener } from '@angular/core';
import { itemAnim } from '../../anims/item.anim';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss'],
  animations: [
    itemAnim
  ]
})
export class TaskItemComponent implements OnInit {

  @Input() item;
  @Input() avatar;
  @Output() taskClick = new EventEmitter<void>();
  public widthAnim = 'in'

  @HostListener('mouseenter')
  onMouseEnter() {
    this.widthAnim = 'out'
  }

  @HostListener('mouseleave')
  onMouseLeave() {
    this.widthAnim = 'in'
  }

  constructor() { }

  ngOnInit() {
  }

  onItemClick() {
    this.taskClick.emit();
  }

  onCheckBoxClick(e: Event) {
    e.stopPropagation();
  }

}
