import { Component } from '@angular/core';
import { IonicPage, NavController,Platform, NavParams,LoadingController, AlertController } from 'ionic-angular';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/timeout';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { DocumentViewer } from '@ionic-native/document-viewer';
import { Events } from 'ionic-angular';
/**
 * Generated class for the MainPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-main',
  templateUrl: 'main.html',
})
export class MainPage {
  url;
  success;
  error;
  load;
  ebooks;
  topEbooks;
  Toperror;
  id;
  loggedIn;
  constructor(public navCtrl: NavController, public navParams: NavParams,private alert:AlertController,private loading:LoadingController,private http:Http,private file: File, private transfer: FileTransfer, private platform: Platform,private document: DocumentViewer,public events: Events) {
    
    events.subscribe('id', userid => {
      console.log('Welcome', userid);
      this.id = userid;
       console.log("id is "+ this.id);
    if(this.id == null){
      this.loggedIn = false;
    }else{
      this.loggedIn=true;
    }
    console.log("LoggedIn MainPage:" + this.loggedIn);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MainPage ');
  

    // ///this.id= window.localStorage.getItem('userid');
    // console.log("id os "+ this.id);
    // if(this.id == null){
    //   this.loggedIn = false;
    // }else{
    //   this.loggedIn= true;
    // }
    // console.log("LoggedIn:" + this.loggedIn);
    this.get_all_ebook();
  }

   get_all_ebook(){
    this.load = this.loading.create({
      spinner:'crescent',
      content:'Loading....'
    });
    this.load.present();
    this.get_top_ebook();
    let id= window.localStorage.getItem('userid');
    this.url = "http://www.reflexionesdelpastor.com/appadmin/get_ebooks.php?id="+id;
    console.log(this.url);

    this.http.get(this.url).
    timeout(6000).
    map(res=>res.json()).
    subscribe( data => {
        console.log(data);

        if(data.error == undefined){
          this.success = data.success;
          if(this.success){

            this.ebooks = data.data;
          }else{
            this.error = "There is no Ebook uploaded by Admin!";
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


  get_top_ebook(){
   
    let id= window.localStorage.getItem('userid');
    this.url = "http://www.reflexionesdelpastor.com/appadmin/get_top_ebooks.php?id="+id;
    console.log(this.url);

    this.http.get(this.url).
    timeout(6000).
    map(res=>res.json()).
    subscribe( data => {
        console.log(data);

        if(data.error == undefined){
          this.success = data.success;
          if(this.success){

            this.topEbooks = data.data;
          }else{
            this.Toperror = "There is no pinned ebook available!";
          }
        }
        
    },
    error =>{
      console.log(error);
      let alert = this.alert.create({
        title: 'Oops!',
        subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
        buttons: ['Okay']
      });
      alert.present();
    }
  
  )

  }

  openPdf(ebook:any){
    this.load = this.loading.create({
      spinner:'crescent',
      content:'Loading....'
    });
    this.load.present();
    let pdf = "http://www.reflexionesdelpastor.com/appadmin/ebooks/"+ebook;
    let path = null;
    if (this.platform.is('ios')) {
      path = this.file.documentsDirectory;
    } else if (this.platform.is('android')) {
      path = this.file.dataDirectory;
      console.log(path);
    }
    const transfer = this.transfer.create();
    transfer.download(pdf, path + 'myfile.pdf').then(entry => {
      let url = entry.toURL();
      console.log(url);  
     this.load.dismiss();
      this.document.viewDocument(url, 'application/pdf', {});
    });

}
}