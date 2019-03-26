import { Component } from '@angular/core';
import { Events } from 'ionic-angular';
import { NavParams,NavController,LoadingController, AlertController,Platform } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  url;
  success;
  error;
  loginForm;
  load;
  name;
  errorMsg;
  userStatus;
  Error:boolean=false;
  constructor(public navCtrl: NavController,public navParams: NavParams,private alert:AlertController,private loading:LoadingController,fb:FormBuilder,private http:Http , private events:Events) {
    this.loginForm = FormGroup;
    this.loginForm = fb.group({

      'email'  :  [null, Validators.compose([Validators.required,Validators.email])],
      'password'  :   [null, Validators.required]
    });
  }

  login(value:any){

    if(!this.loginForm.valid){
      let alert = this.alert.create({
        title: 'Oops!',
        subTitle: 'Please Fill Required Fields',
        buttons: ['Okay']
      });
      alert.present();
    //  this.errorMsg = "Please fill both the fields";
    }else{


    this.load = this.loading.create({
      spinner:'crescent',
      content:'Loading....'
    });
    this.load.present();
    this.login_users(value);
  }
  }

  login_users(value:any):void{

    this.url = "http://www.reflexionesdelpastor.com/appadmin/login.php?email="+value.email+"&password="+value.password;
      //console.log(this.url);
      this.http.get(this.url)
      .timeout(6000)
      .map( res => res.json() )
      .subscribe( data => {

        console.log(data);
        
        if(data.error==undefined){

            if(data.success){

              //console.log(data.data.status);
              this.userStatus = data.data.status;
              if(this.userStatus=='Active'){

              window.localStorage.setItem('name',data.data.name);
              window.localStorage.setItem('userid',data.data.id);
              window.localStorage.setItem('userLevel',data.data.level);
              this.events.publish('id',data.data.id);
              this.navCtrl.setRoot('MainPage');

              }else{
              this.error="Tu cuenta aun no ha sido aprobada, por favor inténtalo en algunas horas. Si en 24 horas aun recibes este mensaje por favor envíanos un correo electrónico a pastor@reflexionesdelpastor.com ";
              this.Error=true;
              }
              // window.localStorage.setItem('name',data.data.name);
              // window.localStorage.setItem('userid',data.data.id);
              // this.name=data.data.name;
              // this.events.publish('name',this.name);

              // this.navCtrl.setRoot('MainPage');

            }else{
              this.error="Invalid Email or Password! ";
              this.Error=true;

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
      } );

  }

  SignUp(){
    this.navCtrl.push('RegisterPage');
  }

}
