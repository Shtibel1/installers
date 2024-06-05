import { LayoutModule } from '@angular/cdk/layout';
import { CdkColumnDef } from '@angular/cdk/table';
import { DatePipe } from '@angular/common';
import {
  HTTP_INTERCEPTORS,
  HttpClientJsonpModule,
  HttpClientModule,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserModule } from '@angular/platform-browser'; // Add this line
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxMaskModule } from 'ngx-mask';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AuthComponent } from './components/auth/auth.component';
import { MarketersComponent } from './components/marketers/marketers.component';
import { SideNavComponent } from './components/side-nav/side-nav.component';
import { CustomMatPaginatorIntl } from './core/common/hebrew-paginator';
import { AuthInterceptorService } from './core/interceptors/auth-interceptor.service';
import { MaterialModule } from './core/modules/material.module';

@NgModule({
  declarations: [AuthComponent, SideNavComponent, AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    LayoutModule,
    MaterialModule,
    AppRoutingModule,
    ReactiveFormsModule,
    HttpClientJsonpModule,
    HttpClientModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: CustomMatPaginatorIntl,
    },
    CdkColumnDef,
    { provide: MAT_DIALOG_DATA, useValue: null },
    { provide: MatDialogRef, useValue: {} },

    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptorService,
      multi: true,
    },
    { provide: MAT_DATE_LOCALE, useValue: 'israel' },
    DatePipe,
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
