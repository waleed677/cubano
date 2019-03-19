import { Component,ViewChild } from '@angular/core';
import { Platform,Nav } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { FCM } from '@ionic-native/fcm';
import { FirstPage } from '../pages/first/first';
import { HomePage } from '../pages/home/home';
import { Events } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;
  rootPage:any = FirstPage;
  loggedIn;
  id;
  status;
  url;
  hide;
  hideIn;
  constructor(platform: Platform, statusBar: StatusBar, splashScreen: SplashScreen,private fcm: FCM,private events: Events,private http:Http) {
    var i = 0;

   
    events.subscribe('id', userid => {
      this.id = userid;
       console.log("App mai id is "+ this.id);
    if(this.id == null){
      this.loggedIn = false;
    }else{
      this.loggedIn=true;
    }
    console.log("LoggedIn App.html:" + this.loggedIn);
    });
    
    setInterval(function(){
      //console.log('function called');
       this.url = "http://www.reflexionesdelpastor.com/appadmin/check_status.php";
      //console.log(this.url);
      http.get(this.url).
      timeout(6000).
      map(res=>res.json()).
      subscribe( data => {
          //console.log(data);
  
          if(data.error == undefined){
           this.status = data.data.hide;
           events.publish('hide',this.status);
          }
        
      },
      error =>{
        console.log(error);
      
      })
    },3000)


    events.subscribe('hide', hide => {
      this.hide = hide;
       //console.log("status "+ this.hide);
    if(this.hide == 'No'){
      this.hideIn = false;
    }else{
      this.hideIn=true;
    }
   // console.log("HIdeIn App.html:" + this.hideIn);
    });

    this.checkStatus();
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      if(platform.is('ios')){
        fcm.subscribeToTopic('ios');
        fcm.subscribeToTopic('all');
      }
      else if(platform.is('android')){
        //fcm.subscribeToTopic('android').then(msg => console.log('success::'+msg)).catch(err => console.log('error:'+err));
        fcm.subscribeToTopic('android');
        fcm.subscribeToTopic('all');

      }
      splashScreen.hide();


    });
  
  }

  checkStatus(){
    console.log('function called');
       this.url = "http://www.reflexionesdelpastor.com/appadmin/check_status.php";
      //console.log(this.url);
      this.http.get(this.url).
      timeout(6000).
      map(res=>res.json()).
      subscribe( data => {
          console.log(data);
  
          if(data.error == undefined){
           this.status = data.data.hide;
           this.events.publish('hide',this.status);
          }
        
      },
      error =>{
        console.log(error);
      
      })
  }

  homePage(){
    if(this.loggedIn){
      this.nav.setRoot('MainPage');
    }else{
    this.nav.setRoot(FirstPage);
    }
  }

  chat(){
    this.nav.setRoot('ChatPage');
  }

  login(){
    this.nav.push(HomePage);

  }

  about(){
    this.nav.setRoot('AboutPage');
  }

  mas(){
    this.nav.setRoot('MasPage');
  }

  ofrendas(){
    this.nav.setRoot('OfrendasPage');
  }

  contactarnos(){
    this.nav.setRoot('ContactarnosPage');
  }

  logout(){
    window.localStorage.removeItem('userid');
    window.localStorage.clear();
    this.events.publish('id',null);
    this.nav.setRoot(FirstPage);
  }
}
