export const navigation = [

  {

    name: 'Accueil',

    url: '/home',

    icon: 'fa fa-home',

  },
  {

    name: "Gestion d'accès",
    url: '/manage-access',

    icon: 'icon-speedometer',
    roles: ['ADMIN STAROIL']

  },

  {
    name : 'Gestion des utilisateurs',
    url: '/list/users',
    icon: 'fa fa-users',
    roles: ['ADMIN STAROIL']
    // children: [
    //   {
    //     name: 'Accordion',
    //     url: '/base/accordion'
    //   }
    //  ]
  },


  {

    name : 'Détail station ',
    url: '/stations/Détail',
    icon: 'fa fa-industry',
    // roles: ['GERANT']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
   permission:'Détail station'
  },

  {

    name : 'Note débit crédit',
    url: '/NoteDébitCrédit',
    icon: 'fa fa-file-o',
    // roles: ['GERANT']
    roles: ['GERANT'],
   permission:'débit Crédit'
  },

  {

    name : 'Gestion des clients',
    icon: 'fa  fa-gears',
    url: '/client/list',
    // roles: ['ADMIN STAROIL' , 'VALIDATEUR', 'OPERATEUR'],
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
     permission:'Client'
   


  },

  {

    name: 'Gestion des cartes',
    url: '/carte/list',
    icon: 'fa fa-credit-card',
    // roles: ['ADMIN STAROIL','CLIENT','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Carte'

  },
  {
    name: 'Soldes départ',
    url: '/soldedepart',
    icon: 'fa fa-money',
    // roles: ['ADMIN STAROIL','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Soldes départ'
  },

  {

    name : 'Validation des cartes',
    url: '/demandePers',
    icon: 'fa fa-credit-card',
    // roles: ['ADMIN STAROIL','VALIDATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Validation Carte'
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
    icon: 'fa fa-cubes',
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
   permission:'Produit'

  },

  {
    name: 'Gestion des stations',
    url: '/stations/list',
    icon: 'fa fa-industry',
    // roles: ['ADMIN STAROIL','CLIENT','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Station'
  },
  {
    name: 'Gestion des Tpes',
    url: '/Tpe/list',
    icon: 'fa fa-microchip',
    // roles: ['ADMIN STAROIL', 'GERANT','OPERATEUR','VALIDATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'TPE'
  },

  {
    name: 'Gestion des IDs TPE',
    url: '/Terminal/list',
    icon: 'fa fa-microchip',
    // roles: ['ADMIN STAROIL','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Terminal'
  },

  {
    name : 'Historique recharge',
    icon: 'fa fa-history',
    url: '/client/historiqueRecharge',
    // roles: ['ADMIN STAROIL','CLIENT','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Historique Recharge'

  },



  // {
  //   name: 'Suivi Factures',
  //   url: '/SuiviFacture',
  //   icon: 'fa fa-history',
  //   roles: ['ADMIN STAROIL','CLIENT']

  // },
  {
    name: 'Suivi recharge et transfert ',
    url: '/SuiviRechargeTransfert',
    icon: 'fa fa-server',
    // roles: ['ADMIN STAROIL','CLIENT','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Suivi Recharge Transfert'


  },
  {
    name: 'Historique des actions',
    url: '/ListOperations',
    icon: 'fa fa-history',
    // roles: ['ADMIN STAROIL','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Historique des actions'


  },
  {

    name : 'Suivi transactions ',

    url: '/SuiviTransaction',
    icon: 'fa fa-server',
    // roles: ['ADMIN STAROIL','GERANT', 'CLIENT','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Transaction'
  },
  {

    name : 'Historique Client',

    url: '/HistoriqueClient',
    icon: 'fa fa-history',
    // roles: ['ADMIN STAROIL', 'CLIENT','VALIDATEUR','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Historique Client'
  },
  {

    name : 'Liste fichiers ',

    url: '/SuiviFichiers',
    icon: 'fa fa-files-o',
    // roles: ['ADMIN STAROIL','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
    permission:'Liste des fichiers'
  }
  ,

  {

    name : 'Note débit crédit',

    url: '/NoteDébitCrédit',
    icon: 'fa fa-files-o',
    roles: ['ADMIN STAROIL','VALIDATEUR','OPERATEUR'],
    defaults:['ADMIN STAROIL'],
    permission:'débit Crédit'
  },

  {

    name : 'Suivi des réclamations',

    url: '/reclamations',

    icon: 'fa fa-users',

    // roles: ['ADMIN STAROIL','CLIENT', 'GERANT','OPERATEUR']
    roles: ['ADMIN STAROIL','GERANT','VALIDATEUR','OPERATEUR'],
permission:'Suivi des réclamations'
  },




];
