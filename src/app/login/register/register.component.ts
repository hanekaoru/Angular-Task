import { Component, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms'

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class RegisterComponent implements OnInit {

  public items: string[] = [
    'assets/avatar/01.jpg',
    'assets/avatar/02.jpg',
    'assets/avatar/03.jpg',
    'assets/avatar/04.jpg'
  ];
  form: FormGroup;

  constructor(private fb: FormBuilder) { }

  ngOnInit() {
    this.form = this.fb.group({
      email: [],
      name: [],
      password: [],
      repeat: [],
      avatar: ['assets/1.jpg']
    })
  }

  onSubmit({value, valid}, ev: Event) {
    
  }

}
