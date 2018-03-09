import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {

  public items: string[] = [
    "looks_one",
    "looks_two",
    "looks_3",
    "looks_4",
    "looks_5",
    "looks_6"
  ]

  constructor() { }

  ngOnInit() {
  }

}
