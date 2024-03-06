import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { LocationStrategy, HashLocationStrategy, DatePipe, DecimalPipe } from '@angular/common';
import { DemoMaterialModule } from './material.module';
import { ToasterService } from 'angular2-toaster';

import { AppComponent } from './app.component';
import { ModalModule } from 'ngx-bootstrap/modal';
// Import containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

const APP_CONTAINERS = [
  FullLayoutComponent,
  SimpleLayoutComponent
]

// Import components
import {
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
} from './components';

const APP_COMPONENTS = [
  AppAsideComponent,
  AppBreadcrumbsComponent,
  AppFooterComponent,
  AppHeaderComponent,
  AppSidebarComponent,
  AppSidebarFooterComponent,
  AppSidebarFormComponent,
  AppSidebarHeaderComponent,
  AppSidebarMinimizerComponent,
  APP_SIDEBAR_NAV
]

// Import directives
import {
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
} from './directives';

const APP_DIRECTIVES = [
  AsideToggleDirective,
  NAV_DROPDOWN_DIRECTIVES,
  ReplaceDirective,
  SIDEBAR_TOGGLE_DIRECTIVES
]

// Import routing module
import { AppRoutingModule } from './app.routing';

// Import 3rd party components
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { TabsModule } from 'ngx-bootstrap/tabs';
//import { ChartsModule } from 'ng2-charts/ng2-charts';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { LaddaModule } from 'angular2-ladda';
import { ToasterModule } from 'angular2-toaster';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { DataFilterPipe } from './pipes/datafilter.pipe';
import { LoginComponent } from './views/Account/login/login.component';
import { DataTableModule } from 'angular2-datatable';
import { RecoverPasswordComponent } from './views/Account/recover-password/recover-password.component';
import { DataTablesModule } from 'angular-datatables';
import { FabComponent } from './components/fab/fab.component';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { HttpClient } from '@angular/common/http';
import { DateSqlPipe } from './pipes/date-sql.pipe';
import { HomeComponent } from './views/home/home.component';
import { DeclarationTerminalComponent } from './views/terminal/declaration-terminal/declaration-terminal.component';
import { UpdateProfileComponent } from './views/Account/update-profile/update-profile.component';
import { AddTerminalComponent } from './views/terminal/add-terminal/add-terminal.component';
import { NgMultiSelectDropDownModule } from 'ng-multiselect-dropdown';
import { DragDropDirective } from './Directive/drag-drop.directive';
import { LoaderInterceptor } from './interceptors/loader-interceptor.service';
import { AmountPipe } from './pipes/amount.pipe';
import { FilterPipe } from './pipes/filter.pipe';
import { TokenInterceptor } from './services/token.interceptor';
import { UpdatePasswordComponent } from './views/Account/update-password/update-password.component';
import { AddAffilComponent } from './views/affil/add-affil/add-affil.component';
import { EditAffilComponent } from './views/affil/edit-affil/edit-affil.component';
import { ListAffilComponent } from './views/affil/list-affil/list-affil.component';
import { CarteAddComponent } from './views/carte/carte-add/carte-add.component';
import { CarteListComponent } from './views/carte/carte-list/carte-list.component';
import { CarteSettingsComponent } from './views/carte/carte-settings/carte-settings.component';
import { ClientAddComponent } from './views/Client/client-add/client-add.component';
import { ClientEditComponent } from './views/Client/client-edit/client-edit.component';
import { ClientHistoriqueRechargeComponent } from './views/Client/client-historique-recharge/client-historique-recharge.component';
import { ClientInfoComponent } from './views/Client/client-info/client-info.component';
import { ClientListComponent } from './views/Client/client-list/client-list.component';
import { RechargeClientFormComponent } from './views/Client/recharge-client-form/recharge-client-form.component';
import { RechargeClientComponent } from './views/Client/recharge-client/recharge-client.component';
import { RechargeEnMassCarteComponent } from './views/Client/recharge-en-mass-carte/recharge-en-mass-carte.component';
import { DownloadComponent } from './views/download/download.component';
import { ManageAcessComponent } from './views/manage-acess/manage-acess/manage-acess.component';
import { AddUserComponent } from './views/manageUsers/add-user/add-user.component';
import { EditUserComponent } from './views/manageUsers/edit-user/edit-user.component';
import { ListUsersComponent } from './views/manageUsers/list-users/list-users.component';
import { MyLoaderComponent } from './views/my-loader/my-loader.component';
import { PorteurAddComponent } from './views/Porteur/porteur-add/porteur-add.component';
import { PorteurListComponent } from './views/Porteur/porteur-list/porteur-list.component';
import { ProduitAddComponent } from './views/produit/produit-add/produit-add.component';
import { ProduitListComponent } from './views/produit/produit-list/produit-list.component';
import { EditReclmationComponent } from './views/reclamation/edit-reclmation/edit-reclmation.component';
import { ReclamationComponent } from './views/reclamation/reclamation.component';
import { StationAddComponent } from './views/Station/station-add/station-add.component';
import { StationListComponent } from './views/Station/station-list/station-list.component';
import { SuiviRechargeComponent } from './views/suivi-recharge/suivi-recharge.component';
import { ListTerminalComponent } from './views/terminal/list-terminal/list-terminal.component';
import { AddTpeComponent } from './views/tpe/add-tpe/add-tpe.component';
import { ListTpeComponent } from './views/tpe/list-tpe/list-tpe.component';
import { UploadFilesComponent } from './views/upload-files/upload-files.component';
import { ClientDetailsComponent } from './views/Client/client-details/client-details.component';
import { CarteDetailsComponent } from './views/carte/carte-details/carte-details.component';
import { ListOperationComponent } from './views/list-operation/list-operation.component';
import { HistoriqueRechargeTransfertCarteComponent } from './views/carte/historique-recharge-transfert-carte/historique-recharge-transfert-carte.component';
import { StationDetailComponent } from './views/Station/station-detail/station-detail.component';
import { SuiviTransactionComponent } from './views/suivi-transaction/suivi-transaction.component';
import { NoteDebitComponent } from './views/NoteDebitCredit/note-debit/note-debit.component';
import { ReclamationAddComponent } from './views/reclamations/reclamation-add/reclamation-add.component';
import { SuiviFactureComponent } from './views/suivi-facture/suivi-facture.component';
import { AmountInputPipe } from './pipes/amount-input-pipe.pipe';
import { PaiementPSComponent } from './views/Client/paiement-ps/paiement-ps.component';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { SuiviFichiersComponent } from './views/suivi-fichiers/suivi-fichiers.component';
import { NgxMatDateAdapter } from '@angular-material-components/datetime-picker';
import { NoteCreditComponent } from './views/NoteDebitCredit/note-credit/note-credit.component';
import { TransactionsNoteDebitCreditComponent } from './views/NoteDebitCredit/transactions-note-debit-credit/transactions-note-debit-credit.component';
import { NoteDebitCreditComponent } from './views/NoteDebitCredit/note-debit-credit/note-debit-credit.component';
import { LongMsgPipe } from './pipes/long-msg.pipe';
import { EditPlafondPSComponent } from './views/Client/edit-plafond-ps/edit-plafond-ps.component';
import { RepartitionPlafondComponent } from './views/Client/edit-plafond-ps/repartition-plafond/repartition-plafond.component';
import { DemandePersComponent } from './views/demande-pers/demande-pers.component';
import { HistoriqueClientComponent } from './views/historique-client/historique-client.component';
import { MenuItemComponent } from './views/menu-item/menu-item.component';
import { SoldeDepartComponent } from './views/Solde-depart/solde-depart/solde-depart.component';
import { AmountpipePipe } from './pipes/amountpipe.pipe';
import { AmountmillierpipePipe } from './pipes/amountmillierpipe.pipe';
import { AmountmillierpipePipeVirgule } from './pipes/amountmillierpipeVirgule.pipe';
import { TndFormatPipe } from './pipes/tnd-format.pipe';
import { DateValiditePipe } from './pipes/date-validite.pipe';
import { CustomDateFormatPipe } from './custom-date-format.pipe';
import { CdkTreeModule } from '@angular/cdk/tree';
import { translateMsgPipe } from './pipes/translate-msg.pipe';
import {MatTreeModule} from '@angular/material/tree';
import { MatIconModule } from '@angular/material/icon';
//import { PorteurDetailsComponent } from './views/porteur/porteur-details/porteur-details.component';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}


@NgModule({
  imports: [
    BrowserModule, DemoMaterialModule,
    NgMultiSelectDropDownModule.forRoot(),
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      }


    }),
    
    BrowserAnimationsModule,
    AppRoutingModule,
    BsDropdownModule.forRoot(),
    TabsModule.forRoot(),
    ReactiveFormsModule,
    LaddaModule,
    ToasterModule,
    FormsModule,
    HttpClientModule,
    //DataTableModule,
    ModalModule,
    LaddaModule,
    DataTablesModule,
    //MatButtonModule,
    BrowserAnimationsModule,

    DemoMaterialModule,
    MatTreeModule,
    MatButtonModule,
    MatIconModule,
    CdkTreeModule

  ],
  declarations: [
    AppComponent,
    ...APP_CONTAINERS,
    ...APP_COMPONENTS,
    ...APP_DIRECTIVES,
    HomeComponent,
    DeclarationTerminalComponent,
    UpdateProfileComponent,
    AddTerminalComponent,
    ListTerminalComponent,
    AddUserComponent,
    CarteDetailsComponent,
    EditPlafondPSComponent,
    AddAffilComponent,
    StationDetailComponent,
    EditAffilComponent,
    ListUsersComponent,
    ListTpeComponent,
    ListAffilComponent,
    DataFilterPipe,
    translateMsgPipe,
    // PorteurDetailsComponent,
    ManageAcessComponent,
    EditUserComponent,
    LoginComponent,
    RecoverPasswordComponent,
    UpdatePasswordComponent,
    FabComponent,
    DateSqlPipe,
    DateValiditePipe,
    AddTpeComponent,
    ClientAddComponent,
    ClientEditComponent,
    ClientListComponent,
    RechargeClientComponent,
    RechargeClientComponent,
    PorteurListComponent,
    PorteurAddComponent,
    MyLoaderComponent,
    FilterPipe,
    ProduitListComponent,
    ProduitAddComponent,
    StationListComponent,
    StationAddComponent,
    ReclamationComponent,
    CarteListComponent,
    CarteAddComponent,
    CarteSettingsComponent,
    RechargeClientFormComponent,
    RechargeEnMassCarteComponent,
    EditReclmationComponent,
    RepartitionPlafondComponent,
    ClientHistoriqueRechargeComponent,
    ClientInfoComponent,
    DragDropDirective,
    UploadFilesComponent,
    SuiviRechargeComponent,
    AmountPipe,
    DownloadComponent,
    ClientDetailsComponent,
    CarteDetailsComponent,
    ListOperationComponent,
    HistoriqueRechargeTransfertCarteComponent,
    StationDetailComponent,
    SuiviTransactionComponent,
    HistoriqueClientComponent,
    NoteDebitComponent,
    NoteCreditComponent,
    ReclamationAddComponent,
    SuiviFactureComponent,
    AmountInputPipe,
    PaiementPSComponent,
    SuiviFichiersComponent,
    TransactionsNoteDebitCreditComponent,
    NoteDebitCreditComponent,
    LongMsgPipe,
    EditPlafondPSComponent,
    DemandePersComponent,
    MenuItemComponent,
    SoldeDepartComponent,
    AmountpipePipe,
    AmountmillierpipePipe, AmountmillierpipePipeVirgule,
   
    TndFormatPipe, CustomDateFormatPipe
  ],
  providers: [ToasterService, DatePipe, AmountPipe,AmountpipePipe,AmountmillierpipePipe, AmountmillierpipePipeVirgule,DecimalPipe, AmountInputPipe, {
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  },
    // { provide: MAT_DATE_LOCALE, useValue: 'en-GB' },

    { provide: HTTP_INTERCEPTORS, useClass: LoaderInterceptor, multi: true },

    { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true }],
  bootstrap: [AppComponent],
  entryComponents: [AddUserComponent, RechargeClientFormComponent, CarteListComponent]
})
export class AppModule {

}
