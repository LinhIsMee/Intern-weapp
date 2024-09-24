import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppComponent } from './app.component';
import { HeaderComponent } from './maker-component/header/header.component';
import { ListPayComponent } from './maker-component/list-pay/list-pay.component';
import { CheckListPayComponent } from './approved-checker/check-list-pay/check-list-pay.component';
import { HeaderCheckerComponent } from './approved-checker/header-checker/header-checker.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatDialog, MatDialogModule} from '@angular/material/dialog';
import {AddListPayComponent} from './sub-component/add-list-pay/add-list-pay.component';
import {MatIconModule} from '@angular/material/icon';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {ConfirmDeleteComponent} from './sub-component/confirm-delete/confirm-delete.component';
import {UpdateListPayComponent} from './sub-component/update-list-pay/update-list-pay.component';
import {MatTableModule} from '@angular/material/table';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatBadgeModule} from '@angular/material/badge';
import {MatMenuModule} from '@angular/material/menu';
import {ListPayDetailComponent} from './sub-component/list-pay-detail/list-pay-detail.component';
import {HttpClientModule} from '@angular/common/http';
import {ErrorDeleteComponent} from './sub-component/error-delete/error-delete.component';
import { MatSnackBarModule} from '@angular/material/snack-bar';
import {SnackBarComponent} from './sub-component/snack-bar/snack-bar.component';
import {MatTooltipModule} from '@angular/material/tooltip';
import {PaginationComponent} from './sub-component/pagination/pagination.component';
import {MatInputModule} from '@angular/material/input';
import {SnackBarErrorComponent} from './sub-component/snack-bar-error/snack-bar-error.component';
import {NumberOnlyDirective} from './directives/number-only.directive';
import {DialogTextareaComponent} from './sub-component/dialog-textarea/dialog-textarea.component';
import {DialogEnterComponent} from './sub-component/dialog-enter/dialog-enter.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    ListPayComponent,
    CheckListPayComponent,
    HeaderCheckerComponent,
    AddListPayComponent,
    ConfirmDeleteComponent,
    UpdateListPayComponent,
    ListPayDetailComponent,
    ErrorDeleteComponent,
    SnackBarComponent,
    PaginationComponent,
    SnackBarErrorComponent,
    NumberOnlyDirective,
    DialogTextareaComponent,
    DialogEnterComponent
  ],
  imports: [
    BrowserModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatFormFieldModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    ReactiveFormsModule,
    CommonModule,
    MatTableModule,
    MatCheckboxModule,
    FormsModule,
    MatBadgeModule,
    MatMenuModule,
    HttpClientModule,
    MatSnackBarModule,
    MatTooltipModule,
    MatInputModule
  ],

  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
