import "./polyfills";
import {platformBrowserDynamic} from '@angular/platform-browser-dynamic';
import {AppModule} from "./ui-app/app.module";

platformBrowserDynamic().bootstrapModule(AppModule);
