import { NgModule, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormRoutingModule } from './form-routing.module';
import { FormHeaderComponent } from './form-header/form-header.component';
import { BusinessFormComponent } from './business-form/business-form.component';
import { FormDataRowComponent } from './form-data-row/form-data-row.component';
import { FormServiceProxy, FormBusinessUnitServiceProxy} from '@shared/service-proxies/service-proxies';
import { FormDataViewEditComponent } from './form-data-view-edit/form-data-view-edit.component';
import { FormsModule } from '@angular/forms';
import { AddTaskComponent } from './add-task/add-task.component';
 //import {BootstrapAutocompleteModule} from "angular-bootstrap-autocomplete";
//  import { MatAutocompleteModule } from '@angular/material/autocomplete';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule} from '@angular/forms';
import { AddMeetingComponent } from './add-meeting/add-meeting.component';
import { ModalModule } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { AbpValidationSummaryComponent } from '@shared/components/validation/abp-validation.summary.component';
import { SharedModule } from '@shared/shared.module';
import { TooltipModule } from 'ngx-bootstrap/tooltip';
import { FormDataBodyComponent } from './form-data-body/form-data-body.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import {MatMenuModule} from '@angular/material/menu';
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import { DragDropModule } from '@angular/cdk/drag-drop';
import {MatSelectModule} from '@angular/material/select';

@NgModule({
  declarations: [
    FormHeaderComponent,
    FormDataViewEditComponent,
    BusinessFormComponent,
    FormDataRowComponent,
    AddTaskComponent,
    AddMeetingComponent,
    FormDataBodyComponent],
  imports: [
    CommonModule,
    FormRoutingModule,

    FormsModule,//BootstrapAutocompleteModule
    // MatAutocompleteModule,
    // MatFormFieldModule,
    // MatInputModule,
    ReactiveFormsModule,
    ModalModule.forChild(),
    NgSelectModule,
    SharedModule,
    TooltipModule,
    NgbModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    DragDropModule,
    MatSelectModule
  ],

   providers: [FormServiceProxy, FormBusinessUnitServiceProxy]
})
export class FormModule { }
