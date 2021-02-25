import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientJsonpModule } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import { ModalModule } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { CollapseModule } from 'ngx-bootstrap/collapse';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { NgxPaginationModule } from 'ngx-pagination';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceProxyModule } from '@shared/service-proxies/service-proxy.module';
import { SharedModule } from '@shared/shared.module';
import { HomeComponent } from '@app/home/home.component';
import { AboutComponent } from '@app/about/about.component';
import { PreviewSubsectionComponent } from './form-preview/preview-subsection/preview-subsection.component';

// tenants
import { TenantsComponent } from '@app/tenants/tenants.component';
import { CreateTenantDialogComponent } from './tenants/create-tenant/create-tenant-dialog.component';
import { EditTenantDialogComponent } from './tenants/edit-tenant/edit-tenant-dialog.component';
// roles
import { RolesComponent } from '@app/roles/roles.component';
import { CreateRoleDialogComponent } from './roles/create-role/create-role-dialog.component';
import { EditRoleDialogComponent } from './roles/edit-role/edit-role-dialog.component';
// users
import { UsersComponent } from '@app/users/users.component';
import { CreateUserDialogComponent } from '@app/users/create-user/create-user-dialog.component';
import { EditUserDialogComponent } from '@app/users/edit-user/edit-user-dialog.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { ResetPasswordDialogComponent } from './users/reset-password/reset-password.component';
// layout
import { HeaderComponent } from './layout/header.component';
import { HeaderLeftNavbarComponent } from './layout/header-left-navbar.component';
import { HeaderLanguageMenuComponent } from './layout/header-language-menu.component';
import { HeaderUserMenuComponent } from './layout/header-user-menu.component';
import { FooterComponent } from './layout/footer.component';
import { SidebarComponent } from './layout/sidebar.component';
import { SidebarLogoComponent } from './layout/sidebar-logo.component';
import { SidebarUserPanelComponent } from './layout/sidebar-user-panel.component';
import { SidebarMenuComponent } from './layout/sidebar-menu.component';
import { FormModule } from './form-view/form.module';
import { CodeEffectComponent } from './admin/code-effect/code-effect.component';
import { AdminCodeEffectComponent } from './admin/admin-code-effect/admin-code-effect.component';

import { NgSelectModule } from '@ng-select/ng-select';
// import { BrowserModule } from '@angular/platform-browser';
import { FormAssignmentComponent } from './form/form-assignment/form-assignment.component';
import { FormsListComponent } from './form/forms-list/forms-list.component';
import { AddNewFormComponent } from './form/add-new-form/add-new-form.component';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { FormDesignComponent } from './form-designer/form-design/form-design.component';
import { CreatFormAssignmentComponent } from './form/creat-form-assignment/creat-form-assignment.component';
import { FormDesignKpiComponent } from './form-designer/form-design-kpi/form-design-kpi.component';
import { FormDesignerSectionComponent } from './form-designer/form-designer-section/form-designer-section.component';
import { FormDesignerBodyComponent } from './form-designer/form-designer-body/form-designer-body.component';
import { UiSwitchModule } from 'ngx-ui-switch';
import { FormDesignDimensionComponent } from './form-designer/form-design-dimension/form-design-dimension.component';
import { FormDesignerAddKpiDialogComponent } from './form-designer/form-designer-add-kpi-dialog/form-designer-add-kpi-dialog.component';
import { FormDesignerRowComponent } from './form-designer/form-designer-row/form-designer-row.component';
import { FormDesignerAddSectionDialogComponent } from './form-designer/form-designer-add-section-dialog/form-designer-add-section-dialog.component';
// darg and drop
import { DragDropModule } from '@angular/cdk/drag-drop';
import { FormDesignerAddDimensionDialogComponent } from './form-designer/form-designer-add-dimension-dialog/form-designer-add-dimension-dialog.component';
import { FormDesignerAddMeasureDialogComponent } from './form-designer/form-designer-add-measure-dialog/form-designer-add-measure-dialog.component';
import { FormDesignerAddSubsectionDialogComponent } from './form-designer/form-designer-add-subsection-dialog/form-designer-add-subsection-dialog.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { FormDesignerPivotControlDialogComponent } from './form-designer/form-designer-pivot-control-dialog/form-designer-pivot-control-dialog.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatMenuModule } from '@angular/material/menu';
import { DraggableTableComponent } from './form-designer/draggable-table/draggable-table.component';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { CopyKpisComponent } from './form-designer/copy-kpis-dialog/copy-kpis-dialog.component';
import { MatRadioModule } from '@angular/material/radio';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { FormPreviewRowComponent } from './form-preview/form-preview-row/form-preview-row.component';
// toggle btn
// import { NgxBootstrapSwitchModule } from 'ngx-bootstrap-switch';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// RECOMMENDED
// NOT RECOMMENDED (Angular 9 doesn't support this kind of import)

// skeleton loaders
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { FilterationPipe } from '@shared/pipes/filteration.pipe';
import { SumDimensionsDialogComponent } from './form-designer/sum-dimensions-dialog/sum-dimensions-dialog.component';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    AboutComponent,
    // tenants
    TenantsComponent,
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    RolesComponent,
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    UsersComponent,
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ChangePasswordComponent,
    ResetPasswordDialogComponent,
    // layout
    HeaderComponent,
    HeaderLeftNavbarComponent,
    HeaderLanguageMenuComponent,
    HeaderUserMenuComponent,
    FooterComponent,
    SidebarComponent,
    SidebarLogoComponent,
    SidebarUserPanelComponent,
    SidebarMenuComponent,
    SidebarMenuComponent,
    CodeEffectComponent,
    AdminCodeEffectComponent,
    FormAssignmentComponent,
    FormsListComponent,
    AddNewFormComponent,
    FormDesignComponent,
    FormDesignKpiComponent,
    CreatFormAssignmentComponent,
    FormDesignerSectionComponent,
    FormDesignerBodyComponent,
    FormDesignDimensionComponent,
    FormDesignerAddKpiDialogComponent,
    FormDesignerRowComponent,
    FormDesignerAddSectionDialogComponent,
    FormDesignerAddDimensionDialogComponent,
    FormDesignerAddMeasureDialogComponent,
    FormDesignerAddSubsectionDialogComponent,
    FormDesignerPivotControlDialogComponent,
    DraggableTableComponent,
    CopyKpisComponent,
    PreviewSubsectionComponent,
    FormPreviewRowComponent,
    DraggableTableComponent,
    FilterationPipe,
    SumDimensionsDialogComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    NgSelectModule,
    ReactiveFormsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    ModalModule.forChild(),
    BsDropdownModule,
    CollapseModule,
    TabsModule,
    AppRoutingModule,
    ServiceProxyModule,
    SharedModule,
    NgxPaginationModule,
    FormModule,
    InfiniteScrollModule,
    UiSwitchModule,
    DragDropModule,
    NgbModule,
    MatExpansionModule,
    MatMenuModule,
    MatButtonModule,
    MatListModule,
    NgxSkeletonLoaderModule,
    MatRadioModule,
    MatCheckboxModule

    //     NgxBootstrapSwitchModule.forRoot(),
    // BrowserAnimationsModule
    // AccordionModule,
    // BrowserModule,
    // NgbAccordion,
  ],
  providers: [],

  entryComponents: [
    // tenants
    CreateTenantDialogComponent,
    EditTenantDialogComponent,
    // roles
    CreateRoleDialogComponent,
    EditRoleDialogComponent,
    // users
    CreateUserDialogComponent,
    EditUserDialogComponent,
    ResetPasswordDialogComponent,
  ]
})
export class AppModule { }
