import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {AppAuthLoginComponent} from "../app-main/app-body/app-auth/app-auth-login/app-auth-login.component";

const MAIN_ROUTES: Routes = [{path: '', pathMatch: 'full', redirectTo: 'login'},
    {path: 'login', component: AppAuthLoginComponent}
];

@NgModule({
    imports: [RouterModule.forRoot(MAIN_ROUTES)],
    exports: [RouterModule]
})

export class AppMainRoutesModule {

}