import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'translateMsg'
})
export class translateMsgPipe implements PipeTransform {

  transform(value: string): any {
if(value.includes("User name")){
if(value.includes("is already taken"))
return "Le nom d'utilisateur est déja prise."
else
return "Le nom d'utilisateur n'est pas valide, il ne peut contenir que des lettres ou des chiffres."

}
else return "L'adresse électronique est déjà prise.";


  }

}
