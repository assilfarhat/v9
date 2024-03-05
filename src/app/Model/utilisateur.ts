export enum Roles {
    Admin = "Admin",
    Manager = "Manager",
    User = "User",
    Commercial= "Commercial",
    SuperCommercial = "SuperCommercial"

}

export enum Permissions {
    ProjectAdd = "project.add"
}


export class Utilisateur {
    dateCreation:string
    createur:string

    idUser: string;
    nom: string;
    prenom: string;
    adresse: string;
    adresseEmail: string;
    motDePasse: string;
    telephone: string;
    valideur1: string;
    valideur2: string;
    type: string;
    lockoutEnabled:boolean;
    lastConnexion:string;
    equipeId:string;
    firstImputation:Date;

    //idProfil: string;
    profilId:string;
    role: Roles;
    permissions: Permissions[];
    token?: string;
    confirmed: boolean
    public defaultUrl(): string {
        let url = '';
        switch (this.role) {
            case Roles.Admin:
                url = '/ReportLivraison';
                break;
                case Roles.SuperCommercial:
                    url = '/ReportLivraison';
                    break;
            case Roles.Manager:
                url = '/ReportLivraison';
                break;
            case Roles.User:
                url = '/profile';
                break;
                case Roles.Commercial:
                    url = '/ReportProjetComptable';
                    break;
            default:
                break;
        }
        return url;
    }


}
