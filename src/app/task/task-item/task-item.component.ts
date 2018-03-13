import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-task-item',
  templateUrl: './task-item.component.html',
  styleUrls: ['./task-item.component.scss']
})
export class TaskItemComponent implements OnInit {

  @Input() item;
  @Input() avatar;
  @Output() taskClick = new EventEmitter<void>();

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
