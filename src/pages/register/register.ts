import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams,LoadingController, AlertController  } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
/**
 * Generated class for the RegisterPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-register',
  templateUrl: 'register.html',
})
export class RegisterPage {
  registeration;
  url;
  load;
  success;
  error;
  constructor(public navCtrl: NavController, public navParams: NavParams,private alert:AlertController,private loading:LoadingController,fb:FormBuilder,private http:Http) {

    this.registeration = FormGroup;
    this.registeration = fb.group({

      'name'      :  [null,Validators.compose([Validators.required,Validators.pattern('[a-zA-ZàáâäãåąčćęèéêëėįìíîïłńòóôöõøùúûüųūÿýżźñçčšžÀÁÂÄÃÅĄĆČĖĘÈÉÊËÌÍÎÏĮŁŃÒÓÔÖÕØÙÚÛÜŲŪŸÝŻŹÑßÇŒÆČŠŽ∂ð ,. ]*')])],
      'email'     :  [null,Validators.compose([Validators.email,Validators.required])],
      'password'  :  [null,Validators.required]
      
    })
  }

  registerations(value:any){
    this.load = this.loading.create({
      content:'Loading....',
      spinner:'crescent' 
    });
    this.load.present();
    this.register_users(value);
}



register_users(value:any){
  this.url = "http://www.reflexionesdelpastor.com/appadmin/registeration.php?name="+value.name+"&email="+value.email+"&password="+value.password;
 console.log(this.url);

this.http.get(this.url).
timeout(6000).
map( res => res.json()).
subscribe ( data => {

    console.log(data);
    if(data.error==undefined){
      this.success = data.success;
      if(this.success){
        let alert = this.alert.create({
          title: 'Felicitaciones!',
          subTitle: 'Tu cuenta fue creada. Nuestro equipo ministerial aprobara tu cuenta en algunas horas. Cuando tu cuenta sea aprobada tu podrás entrar a la aplicación.',
          buttons: ['Okay']

        });
        alert.present();
        this.registeration.reset();
      }else{
        this.error ="Something went Wrong! Try Again"
        this.registeration.reset();
      }
    }

    this.load.dismiss();
},
error =>{
  console.log(error);
  this.load.dismiss();
  let alert = this.alert.create({
    title: 'Oops!',
    subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
    buttons: ['Okay']
  });
  alert.present();
}

)


}


checkEmail(value:string){

  this.url = "http://www.reflexionesdelpastor.com/appadmin/checkEmail.php?email="+value;
  console.log(this.url);

  this.http.get(this.url)
  .timeout(5000)
  .map(res =>res.json())
  .subscribe(data =>{

    if(data.error==undefined){
        if(data.success){
          let alert = this.alert.create({
            title: 'Oops!',
            subTitle: 'Email Already Exists!',
            buttons: ['Okay']
          });
          alert.present();
          this.registeration.controls['email'].reset();
        }
    }

  })

}

  ionViewDidLoad() {
    console.log('ionViewDidLoad RegisterPage');
  }

}
