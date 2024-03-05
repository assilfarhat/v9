import { Component, OnInit } from '@angular/core';
import { UserService } from 'app/services/user.service';
import { TokenService } from 'app/services/token.service';
import { ToasterService } from 'angular2-toaster';
import { AccessFile } from '../../../../assets/access';

@Component({
  selector: 'app-manage-acess',
  templateUrl: './manage-acess.component.html',
  styleUrls: ['./manage-acess.component.scss']
})
export class ManageAcessComponent implements OnInit {
  Access: any[] = [];
  selectedUser: any;
  lang: any;
  roles: any;
  userr: any[] = [];
  selectedRole: string = '';
  loading = false;
  permissions: any[] = []; // Nouvelle structure pour stocker les permissions
  modified = false;

  constructor(
    private userService: UserService,
    private tokenService: TokenService,
    private toasterService: ToasterService
  ) {
    this.lang = this.tokenService.getLang();
  }

  ngOnInit() {
    AccessFile.forEach(element => {
      this.Access.push({ title: element.title, name: element.name, permissions: 0 });
    });

    this.userService.getListRoles().subscribe(
      (list: any) => {
        //console.log("roles1", list)
        this.roles = list.filter(e => e != "ADMIN STAROIL" && e != "CLIENT" && e != "PORTEUR"   && e != "GERANT");
        //console.log("roles", this.roles);
      }
      
    );
  }

  getUserss(id: any) {
    this.userr = [];
    if (id == "") {
      return;
    }
    this.userService.getUserByRole(id).subscribe(
      (resp: any) => {
        this.userr = resp.data;
      }
    );
  }

  selectUser({ target: e }) {
    this.loading = true;
    if (e.value === "") {
      this.permissions = [];
      this.selectedUser = null;
      this.loading = false;
      return;
    }

    this.selectedUser = this.userr.find(t => t.userName == e.value);
    this.userService.getPermissions(this.selectedUser.userName).subscribe((apiData: any[]) => {
      // Réinitialisez la structure des permissions
      this.permissions = apiData;
      this.loading = false;
    });
  }






  // updateValueAccess(child: any) {

    // child.valueaccess = child.test ? 2 : 0;

    // Mettez à jour les autres propriétés valueaccess à 0 sauf pour l'enfant actuel
    // this.node.children.forEach(otherChild => {
      // if (otherChild !== child) {
        // otherChild.valueaccess = 0;
      // }
    // });
    
    // this.checkModifications();
  // }



   
  checkModifications() {
    // Initialisez un drapeau de modification
    let modifications = false;

    // Parcourez la structure des permissions pour vérifier les modifications
    this.permissions.forEach(node => {
      if (node.test !== undefined) {
        if (node.test !== node.initialTest) {
          modifications = true;
         
        }
       
      }

      if (node.children) {
        node.children.forEach(child => {
         
          if (child.test !== undefined) {
            if (child.test !== child.initialTest) {
              modifications = true;
              
            }
             
            
          }
        });
      }
    });
    
    // Mettez à jour le statut de modification
    this.modified = modifications;
  }

  savePermissions() {
    // Collectez les nouvelles autorisations modifiées
    const newPermissions: any[] = [];

    this.permissions.forEach(node => {
      if (node.test !== node.initialTest) {
        newPermissions.push({
          id: node.id,
          test: node.test,
          name: node.name,
         
          idAccess: node.idAccess,
          level: node.level,
          children: node.children
        });
      }
      if (node.children) {
        node.children.forEach(child => {
          if (child.test !== child.initialTest) {

             if (child.test == false){
              newPermissions.push({
                id: child.id,
                test: child.test,
                name: child.name,
                idAccess: child.idAccess,
                valueaccess:0,
                level: child.level,
                children: child.children
              });
              
             }
             if (child.test == true){
              newPermissions.push({
                id: child.id,
                test: child.test,
                name: child.name,
                idAccess: child.idAccess,
                valueaccess:2,
                level: child.level,
                children: child.children
              });
              
             }
          }
        });
      }
    });

 // Envoyez les nouvelles autorisations modifiées au service
 this.userService.changePermissions(this.selectedUser.id, newPermissions).subscribe(
  () => {
    // Mettez à jour les autorisations initiales
    this.permissions.forEach(node => {
      if (node.test !== undefined) {
        console.log('testtest1');
        
        node.initialTest = node.test;
        console.log('node.initialTest', node.initialTest);
      }

      if (node.children) {
        node.children.forEach(child => {
          if (child.test !== undefined) {
            console.log('testtest2');
            child.initialTest = child.test;
            console.log('node.initialTest1', child.initialTest);
            
          }
        });
      }
    });
        this.modified = false;
        this.showSuccessMessage();
          
        setTimeout(() => {
          window.location.reload();
        }, 2000);
      
      },
      () => {
        this.showErrorMessage();
      }
    );
  }

  // clonePermissions(permissions: ExampleFlatNode[]): ExampleFlatNode[] {
    // return permissions.map(permission => ({ ...permission }));
  // }

  showSuccessMessage() {
    if (this.lang == 'fr') {
      this.toasterService.pop('warning', '', 'Les modifications ont été enregistrées');
      // Ajoutez un délai de 5000 millisecondes (5 secondes) pour masquer la notification
  //  setTimeout(() => {
    // this.toasterService.clear(); // Supprime la notification après 15 secondes
    //  }, 15000);
    } else {
      this.toasterService.pop('infwarningo', '', 'The changes have been saved');
    }
  }

  showErrorMessage() {
    if (this.lang == 'fr') {
      this.toasterService.pop('error', '', 'Une erreur est survenue');
    } else {
      this.toasterService.pop('error', '', 'An error has occurred');
    }
  }
  // formatTreeData(data: any[]): ExampleFlatNode[] {
    // // Formatez les données pour correspondre au format attendu
    // return data.map(item => {
      // const node: ExampleFlatNode = {
        // expandable: item.children && item.children.length > 0,
        // name: item.name,
        // test: item.test,
        // idAccess: item.idAccess,
        // valueaccess: item.valueaccess,
        // id: item.id,
        // level: item.level,
        // children: [] // Initialisez le tableau d'enfants
      // };
  
      // if (item.children) {
        // // Appel récursif pour formater les enfants
        // node.children = this.formatTreeData(item.children);
      // }
  
      // return node;
    // });
  // }

  toggleChildrenVisibility(node: any) {
    // Inverse la valeur de isChecked du nœud parent
    node.isChecked = !node.isChecked;
  }
  
  
}
