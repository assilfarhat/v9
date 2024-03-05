export const navigation = [

  {

    name: 'Accueil',

    url: '/home',

    icon: 'icon-speedometer',

  },
  // {

  //   name: 'Gestion d acces',

  //   url: '/manage-access',

  //   icon: 'icon-speedometer',

  // },

  {

    name: 'Gestion des utilisateurs',

    url: '/list/users',
    icon: 'fa fa-users',
    roles: ['ADMIN STAROIL', 'GERANT', 'CLIENT']
  },


  {

    name: 'Détail Station ',
    url: '/stations/Détail',
    icon: 'fa fa-users',
    roles: ['GERANT']
  },

  {

    name: 'Détail societé ',

    url: '/client/Détails',
    icon: 'fa fa-users',
    roles: ['ADMIN STAROIL', 'CLIENT']
  },

  {

    name: 'Suivi Transactions ',

    url: '/SuiviTransaction',
    icon: 'fa fa-users',
    roles: ['ADMIN STAROIL', 'GERANT', 'CLIENT']
  },

  {

    name: 'Historique Client',

    url: '/HistoriqueClient',
    icon: 'fa fa-users',
    roles: ['ADMIN STAROIL', 'GERANT', 'CLIENT']
  },
  // {

  //   name: 'Note Débit ',

  //   url: '/NoteDébit',
  //   icon: 'fa fa-users',
  //   roles: ['ADMIN STAROIL', 'GERANT', 'CLIENT']
  // },
  // {

  //   name: 'Note Crédit',

  //   url: '/NoteCrédit',
  //   icon: 'fa fa-users',
  //   roles: ['ADMIN STAROIL', 'GERANT', 'CLIENT']
  // },



  {

    name: 'Gestion des Clients',
    icon: 'fa  fa-gears',
    url: '/client/list',
    roles: ['ADMIN STAROIL']


  },


  {

    name: 'Gestion des Cartes',
    url: '/carte/list',
    icon: 'fa  fa-gears',

    roles: ['ADMIN STAROIL', 'CLIENT']

  },
  // {

  //   name: 'Gestion des commerçants',

  //   url: '/affilation/list',

  //   icon: 'fa fa-users',

  //   roles: ['ADMIN STAROIL', 'GERANT']

  // },

  {

    name: 'Gestion des produits',

    url: '/produits/list',

    icon: 'fa fa-users',


    roles: ['ADMIN STAROIL', 'CLIENT', 'GERANT']


  },

  {

    name: 'Gestion des stations',

    url: '/stations/list',

    icon: 'fa fa-users',

    roles: ['ADMIN STAROIL', 'CLIENT']

  },
  {

    name: 'Gestion des Tpes',

    url: '/Tpe/list',

    icon: 'fa fa-users',

    roles: ['ADMIN STAROIL', 'GERANT']

  },

  {

    name: 'Gestion des IDs TPE',

    url: '/Terminal/list',

    icon: 'fa fa-users',

    roles: ['ADMIN STAROIL','VALIDATEUR']

  },
  {

    name: 'Historique Recharge Client',
    icon: 'fa  fa-gears',
    url: '/client/historiqueRecharge',
    roles: ['ADMIN STAROIL', 'CLIENT']


  },

  {

    name: 'Suivi des réclamations',

    url: '/list/reclamation',

    icon: 'fa fa-users',

    roles: ['ADMIN STAROIL', 'CLIENT']

  },
  {
    name: 'Historique des actions',
    url: '/ListOperations',
    icon: 'fa fa-history',
    roles: ['ADMIN STAROIL']

  },
  {
    name: 'Suivi Recharge et Transfert cartes',
    url: '/SuiviRechargeTransfert',
    icon: 'fa fa-history',
    roles: ['ADMIN STAROIL', 'CLIENT']


  },



];
