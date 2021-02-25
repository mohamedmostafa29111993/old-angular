
import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AppComponent } from './app.component';
import { AppRouteGuard } from '@shared/auth/auth-route-guard';
import { HomeComponent } from './home/home.component';
import { AboutComponent } from './about/about.component';
import { UsersComponent } from './users/users.component';
import { TenantsComponent } from './tenants/tenants.component';
import { RolesComponent } from 'app/roles/roles.component';
import { ChangePasswordComponent } from './users/change-password/change-password.component';
import { AddTaskComponent } from './form-view/add-task/add-task.component';
import { AdminCodeEffectComponent } from './admin/admin-code-effect/admin-code-effect.component';
import { FormAssignmentComponent } from './form/form-assignment/form-assignment.component';
import { FormsListComponent } from './form/forms-list/forms-list.component';
import { FormDesignComponent } from './form-designer/form-design/form-design.component';
import { FormDesignKpiComponent } from './form-designer/form-design-kpi/form-design-kpi.component';
import { DraggableTableComponent } from './form-designer/draggable-table/draggable-table.component'
import { PreviewSubsectionComponent } from './form-preview/preview-subsection/preview-subsection.component';
@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: AppComponent,
                children: [
                    { path: 'home', component: HomeComponent, canActivate: [AppRouteGuard] },
                    { path: 'users', component: UsersComponent, data: { permission: 'Pages.Users' }, canActivate: [AppRouteGuard] },
                    { path: 'roles', component: RolesComponent, data: { permission: 'Pages.Roles' }, canActivate: [AppRouteGuard] },
                    { path: 'tenants', component: TenantsComponent, data: { permission: 'Pages.Tenants' }, canActivate: [AppRouteGuard] },
                    { path: 'about', component: AboutComponent },
                    { path: 'update-password', component: ChangePasswordComponent },
                    { path: 'business-form', canActivate: [AppRouteGuard], loadChildren: () => import('app/form-view/form.module').then(m => m.FormModule) },
                    { path: 'admin-code-effect', component: AdminCodeEffectComponent, data: { permission: 'Pages.CodeEffect' }, canActivate: [AppRouteGuard] },
                    { path: 'add-task', canActivate: [AppRouteGuard], component: AddTaskComponent },
                    { path: 'form-assignment', component: FormAssignmentComponent, data: { permission: 'Pages.FormAssignment' }, canActivate: [AppRouteGuard] },
                    { path: 'formsList', component: FormsListComponent, data: { permission: 'Pages.FormList' }, canActivate: [AppRouteGuard] },
                    { path: 'form-design/:formId', component: FormDesignComponent, data: { permission: 'Pages.FormList' }, canActivate: [AppRouteGuard] },
                    { path: 'form-design-kpi', component: FormDesignKpiComponent },
                    { path: 'draggable-table', component: DraggableTableComponent},
                    { path: 'preview-subsection/:formId/:subsectionId',component: PreviewSubsectionComponent,  data: { permission: 'Pages.FormList' }, canActivate: [AppRouteGuard]}
                ]
            }
        ])
    ],
    exports: [RouterModule]
})
export class AppRoutingModule { }
