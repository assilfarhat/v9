import { NgModule, Component } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

// Import Containers
import {
  FullLayoutComponent,
  SimpleLayoutComponent
} from './containers';

import { AuthGuardGuard } from './guard/auth-guard.guard';
import { LoginComponent } from './views/Account/login/login.component';
import { RecoverPasswordComponent } from './views/Account/recover-password/recover-password.component';
import { UpdatePasswordComponent } from './views/Account/update-password/update-password.component';
import { UpdateProfileComponent } from './views/Account/update-profile/update-profile.component';
import { AddAffilComponent } from './views/affil/add-affil/add-affil.component';
import { EditAffilComponent } from './views/affil/edit-affil/edit-affil.component';
import { CarteAddComponent } from './views/carte/carte-add/carte-add.component';
import { CarteDetailsComponent } from './views/carte/carte-details/carte-details.component';
import { CarteListComponent } from './views/carte/carte-list/carte-list.component';
import { CarteSettingsComponent } from './views/carte/carte-settings/carte-settings.component';
import { ClientAddComponent } from './views/Client/client-add/client-add.component';
import { ClientDetailsComponent } from './views/Client/client-details/client-details.component';
import { ClientEditComponent } from './views/Client/client-edit/client-edit.component';
import { ClientHistoriqueRechargeComponent } from './views/Client/client-historique-recharge/client-historique-recharge.component';
import { ClientListComponent } from './views/Client/client-list/client-list.component';
import { RechargeClientComponent } from './views/Client/recharge-client/recharge-client.component';
import { RechargeEnMassCarteComponent } from './views/Client/recharge-en-mass-carte/recharge-en-mass-carte.component';
import { HomeComponent } from './views/home/home.component';
import { ManageAcessComponent } from './views/manage-acess/manage-acess/manage-acess.component';
import { AddUserComponent } from './views/manageUsers/add-user/add-user.component';
import { EditUserComponent } from './views/manageUsers/edit-user/edit-user.component';
import { ListUsersComponent } from './views/manageUsers/list-users/list-users.component';
import { PorteurAddComponent } from './views/Porteur/porteur-add/porteur-add.component';
import { PorteurListComponent } from './views/Porteur/porteur-list/porteur-list.component';
import { ProduitAddComponent } from './views/produit/produit-add/produit-add.component';
import { ProduitListComponent } from './views/produit/produit-list/produit-list.component';
import { ReclamationComponent } from './views/reclamation/reclamation.component';
import { StationAddComponent } from './views/Station/station-add/station-add.component';
import { StationListComponent } from './views/Station/station-list/station-list.component';
import { AddTerminalComponent } from './views/terminal/add-terminal/add-terminal.component';
import { ListTerminalComponent } from './views/terminal/list-terminal/list-terminal.component';
import { AddTpeComponent } from './views/tpe/add-tpe/add-tpe.component';
import { ListTpeComponent } from './views/tpe/list-tpe/list-tpe.component';
import { ListOperationComponent } from './views/list-operation/list-operation.component';
import { HistoriqueRechargeTransfertCarteComponent } from './views/carte/historique-recharge-transfert-carte/historique-recharge-transfert-carte.component';
import { StationDetailComponent } from './views/Station/station-detail/station-detail.component';
import { SuiviTransactionComponent } from './views/suivi-transaction/suivi-transaction.component';
import { NoteDebitComponent } from './views/NoteDebitCredit/note-debit/note-debit.component';
import { ReclamationAddComponent } from './views/reclamations/reclamation-add/reclamation-add.component';
import { SuiviFactureComponent } from './views/suivi-facture/suivi-facture.component';
import { PaiementPSComponent } from './views/Client/paiement-ps/paiement-ps.component';
import { SuiviFichiersComponent } from './views/suivi-fichiers/suivi-fichiers.component';
import { NoteCreditComponent } from './views/NoteDebitCredit/note-credit/note-credit.component';
import { NoteDebitCreditComponent } from './views/NoteDebitCredit/note-debit-credit/note-debit-credit.component';
import { EditPlafondPSComponent } from './views/Client/edit-plafond-ps/edit-plafond-ps.component';
import { DemandePersComponent } from './views/demande-pers/demande-pers.component';
import { HistoriqueClientComponent } from './views/historique-client/historique-client.component';
import { SoldeDepartComponent } from './views/Solde-depart/solde-depart/solde-depart.component';



export const routes: Routes = [

  {
    path: 'login',
    component: SimpleLayoutComponent,
    data: {
      title: 'Login'
    },
    children: [
      {
        path: '',
        component: LoginComponent,
      },

    ]
  },
  {
    path: 'recover/password',
    component: SimpleLayoutComponent,
    data: {
      title: 'mot de passe oublié '
    },
    children: [
      {
        path: '',
        component: RecoverPasswordComponent,
      }
    ]
  },
  {
    path: 'changer/password',
    component: SimpleLayoutComponent,

    data: {
      title: 'Changer le mot de passe'
    },
    children: [
      {
        path: '',
        component: UpdatePasswordComponent,
      }
    ]
  },
  {

    path: '',
    component: FullLayoutComponent,
    canActivate: [AuthGuardGuard],

    /*  data: {
        title: 'accueil'
      },*/
    children: [

      {
        path: 'home',
        component: HomeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },

      {
        path: 'carte/add',
        component: CarteAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'carte/add/:id',
        component: CarteAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },

      {
        path: 'carte/settings/:id',
        component: CarteSettingsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },

      {
        path: 'carte/Details/:id',
        component: CarteDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'client/Details',
        component: ClientDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['CLIENT']
        }
      },
      {
        path: 'client/Details/:id',
        component: ClientDetailsComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'SuiviFacture',
        component: SuiviFactureComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'SuiviFichiers',
        component: SuiviFichiersComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },

      {
        path: 'client/rechargeCarte/:id',
        component: RechargeEnMassCarteComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'client/rechargeCarte/:id',
        component: EditPlafondPSComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'client/paiementPs/:id',
        component: PaiementPSComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'carte/list',
        component: CarteListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'carte/list/:id',
        component: CarteListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'carte/list/:id',
        component: CarteListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'soldedepart',
        component: SoldeDepartComponent,
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'stations/Detail',
        component: StationDetailComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['GERANT']
        }
      },
      {
        path: 'demandePers',
        component: DemandePersComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },

      {
        path: 'stations/add/:id',
        component: StationAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      // { 
      //   path: 'affilation/list',
      // component: ListAffilComponent,
      // pathMatch: 'full',

      // },
      {
        path: 'affilation/add',
        component: AddAffilComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'affilation/edit/:id',
        component: EditAffilComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },



      {
        path: 'affilation/edit/:id',
        component: EditAffilComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'SuiviTransaction',
        component: SuiviTransactionComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'GERANT']
        }
      },
      {
        path: 'HistoriqueClient',
        component: HistoriqueClientComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'GERANT']
        }
      },
      {
        path: 'stations/Détail',
        component: StationDetailComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['GERANT']
        }
      },

      {
        path: 'NoteDébit',
        component: NoteDebitComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'GERANT']
        }
      },
      {
        path: 'NoteCrédit',
        component: NoteCreditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'GERANT']
        }
      },

      {
        path: 'NoteDébitCrédit',
        component: NoteDebitCreditComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'GERANT']
        }
      },

      {
        path: 'Terminal/list',
        component: ListTerminalComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'Terminal/add',
        component: AddTerminalComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'Terminal/edit/:id',
        component: AddTerminalComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },


      {
        path: 'Tpe/list',
        component: ListTpeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'Tpe/add',
        component: AddTpeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },

      {
        path: 'Tpe/edit/:id',
        component: AddTpeComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'stations/list',
        component: StationListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },


      {
        path: 'produits/add',
        component: ProduitAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'produits/add/:id',
        component: ProduitAddComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      // {
      //   path: 'porteur/Carte/:id', component: PorteurDetailsComponent,      pathMatch: 'full'
      // },
      {
        path: 'Carte/update/:id', component: PorteurAddComponent, pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'produits/list',
        component: ProduitListComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'edit-profil',
        component: UpdateProfileComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'manage-access',
        component: ManageAcessComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'add/user',
        component: AddUserComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'list/users',
        component: ListUsersComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'edit/users',
        component: EditUserComponent,
        canActivate: [AuthGuardGuard],
        pathMatch: 'full',
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: '',
        component: HomeComponent,
        canActivate: [AuthGuardGuard]
        , data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      { path: 'client/list', component: ClientListComponent, canActivate: [AuthGuardGuard] },
      { path: 'client/add', component: ClientAddComponent, canActivate: [AuthGuardGuard] },
      { path: 'client/edit/:id', component: ClientAddComponent, canActivate: [AuthGuardGuard] },
      { path: 'client/RechargeClient/:id', component: RechargeClientComponent, canActivate: [AuthGuardGuard] },
      { path: 'client/paramétrePlafondPS/:id', component: EditPlafondPSComponent, canActivate: [AuthGuardGuard] },

      {
        path: 'client/historiqueRecharge', component: ClientHistoriqueRechargeComponent, canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'client/historiqueRecharge/:id', component: ClientHistoriqueRechargeComponent, canActivate: [AuthGuardGuard]
        , data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },

      {
        path: 'porteur/list', component: PorteurListComponent, canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      // { path: 'porteur/Detail', component: PorteurDetailsComponent, canActivate: [AuthGuardGuard] },
      //{ path: 'porteur/Carte/:id', component: PorteurDetailsComponent, canActivate: [AuthGuardGuard] },

      {
        path: 'porteur/list/:id', component: PorteurListComponent, canActivate: [AuthGuardGuard], data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'porteur/add', component: PorteurAddComponent, canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'reclamations', component: ReclamationComponent, canActivate: [AuthGuardGuard], data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
      {
        path: 'reclamations/Add', component: ReclamationAddComponent, canActivate: [AuthGuardGuard], data: {
          role: ['ADMIN STAROIL', 'CLIENT', "GERANT"]
        }
      },
      {
        path: 'ListOperations',
        component: ListOperationComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL']
        }
      },
      {
        path: 'SuiviRechargeTransfert',
        component: HistoriqueRechargeTransfertCarteComponent,
        pathMatch: 'full',
        canActivate: [AuthGuardGuard],
        data: {
          role: ['ADMIN STAROIL', 'CLIENT']
        }
      },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]

})
export class AppRoutingModule { }
