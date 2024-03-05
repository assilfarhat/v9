export const navigationEn = [
  {
    name: 'Home',
    url: '/home',
    icon: 'icon-speedometer',
  },
  {
    name : 'Management Of Users',
    url: '',
    icon: 'fa fa-users',
    roles: ['ADMIN MSS','ADMIN ORGANISME'],
    children : [
      {
        name : 'Add User',
        url: '/add/user',
        icon: 'fa fa-user-plus'
      },
      
      {
        name : 'List Of users',
        url: '/list/users',
        icon: 'fa fa-list'
      }
    ]
  },
  {
    name : 'Management Of Organizations',
    url: '',
    icon: 'fa fa-users',
    roles: ['ADMIN MSS'],
    children : [
      {
        name : 'Add Organisation',
        url: '/add/organisme',
        icon: 'fa fa-user-plus',
       
      },
     
      {
        name : 'List Of Organizations',
        url: '/list/organisme',
        icon: 'fa fa-list'
      }
    ]
  },
  {
    name: 'Management Of Access Rights',
    url: '/manage/acess',
    icon : 'fa fa-cogs',
    roles: ['ADMIN MSS','ADMIN ORGANISME'],

    
  },
  
  {
    name: 'List Of Transactions ' ,
    url : '/list/transaction',
    icon : 'fa fa-list',
    roles: ['ADMIN MSS','ADMIN ORGANISME'],
    
  },
  {
    name: 'Configuration' ,
    url : '',
    icon : 'fa  fa-gears',
    roles: ['SUPERVISEUR'],   
    children : [
      {
        name : 'Merchant',
        url: '/list/enseignes',
        permission:'Merchant',
        
      },
      {
        name : 'Store',
        url: '/list/magasins',
        permission:'Magasin' 
      },
      {
        name : 'TPEs',
        url: '/list/tpe',
       permission:'Tpe' 
      },
      {
        name : 'Terminals',
        url: '/list/terminaux',
        permission:'Terminal'
      }
      
     
    ]
  },
  
  
   //{
   //  name: 'Software Update' ,
   // url : '',
   // icon : 'fa  fa-gears',
   // roles: ['SUPERVISEUR'], 
   // permission:'Version',
  
   // children : [
   //   {
   //     name : 'Management Of versions ',
   //     url: '/list/version',
   //     permission:'Version'
        
   //   },
   //   {
   //     name : 'Versions Assignment',
   //     url: '/affect/version',
   //     permission:'Version'
   //   },
   //   {
   //     name : 'Update Tracking',
   //     url: '/suivie/miseajour',
   //     permission:'Version'
   //   }
   // ]

   // },
    {
      name: 'Transactions Tracking' ,
      url : '/suivie/transaction',
      icon : 'fa fa-list',
      roles: ['SUPERVISEUR'],
      defaults:['USER BANK','MERCHANT','MAGASIN'],
      permission:'Suivie'
      
    },
];
