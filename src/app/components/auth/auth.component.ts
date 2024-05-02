import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { map, take } from 'rxjs';
import { AuthService } from 'src/app/core/services/auth.service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.component.html',
  styleUrls: ['./auth.component.scss'],
})
export class AuthComponent implements OnInit {
  loginForm: FormGroup = new FormGroup({});
  hidePassword = true;
  errMessage?: string | null;

  constructor(private accountsService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.accountsService.user$.subscribe((user) => {
      if (user) {
        this.router.navigateByUrl('');
      }
    });

    this.initForm();
  }

  onSubmit() {
    let username = this.loginForm.get('username')?.value;
    let password = this.loginForm.get('password')?.value;
    this.accountsService.login(username, password).subscribe({
      next: (res) => {
        this.router.navigate(['']);
      },
      error: (msg) => {
        this.errMessage = msg;
      },
    });
  }

  initForm() {
    this.loginForm = new FormGroup({
      username: new FormControl(null, [Validators.required]),
      password: new FormControl(null, Validators.required),
    });
  }
}
