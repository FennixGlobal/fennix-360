import {NgModule} from "@angular/core";
import {AppComponent} from "./app.component";
import {BrowserModule} from "@angular/platform-browser";
import {ReactiveFormsModule} from "@angular/forms";
import {StoreModule} from "@ngrx/store";
import {HttpClientModule} from "@angular/common/http";
import {AppMainRoutesModule} from "./app-routes/app-main-routes.module";
import {AppAuthLoginComponent} from "./app-main/app-body/app-auth/app-auth-login/app-auth-login.component";

@NgModule({
    declarations: [AppComponent,AppAuthLoginComponent],
    imports:[
        BrowserModule,
        HttpClientModule,
        ReactiveFormsModule,
        AppMainRoutesModule
        // StoreModule.forRoot(reducers),
    ],
    bootstrap: [AppComponent]
})
export class AppModule {

}