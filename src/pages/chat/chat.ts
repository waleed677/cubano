import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, AlertController,ToastController } from 'ionic-angular';
import { FormBuilder, FormGroup, Validators, FormsModule } from '@angular/forms';
import { Http } from '@angular/http';
import { Events } from 'ionic-angular';
import 'rxjs/add/operator/map';
import { jsonpFactory } from '@angular/http/src/http_module';
/**
 * Generated class for the ChatPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-chat',
  templateUrl: 'chat.html',

})
export class ChatPage {
  tComment;
  splitName;
  post;
  allposts;
  allcomments;
  posttext;
  url;
  load;
  success;
  error;
  alerts;
  user_Id;
  cards: any;
  loggedIn;
  id;
  show: boolean = false;
  testRadioOpen = false;
  testRadioResult: any;
  category: string = 'gear';
  comment;
  totalpost;
  filter;
  showDebate:boolean= false;
  debateComment:boolean = false;
  postid:any;
  userLevel;
  constructor(public navCtrl: NavController, public navParams: NavParams, public alertController: AlertController, private loading: LoadingController, fb: FormBuilder, private http: Http, private events: Events,public toastCtrl: ToastController) {


    this.comment = FormGroup;
    this.post = FormGroup;
    this.post = fb.group({

      'posts': [null, Validators.required]
    })

    this.comment = FormGroup;
    this.comment = fb.group({

      'comments': [null, Validators.required]
    })

  }



  ionViewDidLoad() {
    this.id = window.localStorage.getItem('userid');
    this.userLevel = window.localStorage.getItem('userLevel');
    console.log('ID in ChatPage is:', this.id);
    console.log('userLevel in ChatPage is:', this.userLevel);
    if (this.id == null) {
      this.loggedIn = false;
    } else {
      this.loggedIn = true;
    }
    console.log("LoggedIn ChatPage:" + this.loggedIn);

    if (this.loggedIn) {
      this.show = true;
    } else {
      console.log('show', this.show);
    }

    //console.log("LoggedIn chat.html:" + this.loggedIn);
    this.showPost();
    this.showcomments();
  }

  protected deletePost(pid:any) {
    console.log("post id for delete:",pid);
    this.url = "http://www.reflexionesdelpastor.com/appadmin/deletePost.php?postid=" + pid;
    console.log(this.url);
   this.http.get(this.url). 
    timeout(6000).
    map(res => res.json()).
    subscribe(data => {
       if(data.error==undefined){
         this.success = data.success;
         if(this.success){
           const toast = this.toastCtrl.create  ({
            message: 'Post Deleted Successfully!',
            duration: 3000,
            position: 'bottom'
           });
           toast.present();
           this.showPost();
         }
       }
    })
  }

  protected adjustTextArea(event: any): void {
    let textarea: any = event.target;
    textarea.style.overflow = 'hidden';
    textarea.style.height = 'auto';
    textarea.style.height = textarea.scrollHeight + 'px';
    return;
  }

  protected posts(value: any) {

    this.posttext = value.posts;
    this.user_Id = window.localStorage.getItem('userid');
    this.doRadio(this.posttext, this.user_Id);
  }

  protected insertPosts(posttext, userid, option) {

    console.log('insertPosts');
    this.load = this.loading.create({
      content: 'Loading....',
      spinner: 'crescent'
    });
    this.load.present();

    this.url = "http://www.reflexionesdelpastor.com/appadmin/insertPosts.php?post=" + posttext + "&option=" + option + "&id=" + userid;
    console.log(this.url);
    this.http.get(this.url).
      timeout(6000).
      map(res => res.json()).
      subscribe(data => {

        console.log(data);
        if (data.error == undefined) {
          this.success = data.success;
          if (this.success) {
            this.showPost();
            this.post.reset();
          } else {
            this.error = "Something went Wrong! Try Again"
            this.post.reset();
          }
        }
        this.load.dismiss();
      },
        error => {
          console.log(error);
          this.load.dismiss();
          let alert = this.alertController.create({
            title: 'Oops!',
            subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
            buttons: ['Okay']
          });
          alert.present();
        }

      )

  }


  protected postComment(value:any, post_id) {

    console.log("Post id is", post_id);
    console.log(value.comments)

    this.load = this.loading.create({
      content: 'Loading....',
      spinner: 'crescent'
    });
    this.load.present();

    this.user_Id = window.localStorage.getItem('userid');
    this.url = "http://www.reflexionesdelpastor.com/appadmin/insertComments.php?comment=" + value.comments + "&postid=" + post_id + "&id=" + this.user_Id;
    console.log(this.url);

    this.http.get(this.url).
      timeout(6000).
      map(res => res.json()).
      subscribe(data => {

        console.log(data);
        if (data.error == undefined) {
          this.success = data.success;
          if (this.success) {
            this.showcomments();
            this.showPost();
            console.log('done');
            this.comment.reset();
          } else {
            this.error = "Something went Wrong! Try Again"
            this.comment.reset();
          }
        }
        this.load.dismiss();
      },
      error => {
        console.log(error);
        this.load.dismiss();
        let alert = this.alertController.create({
          title: 'Oops!',
          subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
          buttons: ['Okay']
        });
        alert.present();
      }

    )

  }




  protected doRadio(posttext, userid) {

    this.alerts = this.alertController.create();
    this.alerts.setTitle('Select Type');

    this.alerts.addInput({
      type: 'radio',
      label: 'Public',
      value: 'Public',
      checked: true
    });

    this.alerts.addInput({
      type: 'radio',
      label: 'Debate',
      value: 'Debate',
    });

    this.alerts.addButton('Cancel');
    this.alerts.addButton({
      text: 'Ok',
      handler: (data: any) => {
        console.log("Option Selected", data)
        this.testRadioOpen = false;
        this.testRadioResult = data;
        this.insertPosts(posttext, userid, this.testRadioResult);
      }

    });
    this.alerts.present();



  }

  protected showPost() {
    this.url = "http://www.reflexionesdelpastor.com/appadmin/getPosts.php";
    this.http.get(this.url).
      timeout(6000).
      map(res => res.json()).
      subscribe(data => {
        if (data.error == undefined) {
          this.success = data.success;
          this.totalpost = data.total;
          if (this.success) {
            this.allposts = data.data;
            
          }
          else {
            this.error = "There is no Posts avaiable";
          }
        }

      },
        error => {
          console.log(error);
          this.load.dismiss();
          let alert = this.alertController.create({
            title: 'Oops!',
            subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
            buttons: ['Okay']
          });
          alert.present();
        }
      )


  }


  protected onChange($event) {
    this.filter = $event;
    console.log(this.filter);
    this.url = "http://www.reflexionesdelpastor.com/appadmin/postFilter.php?filter="+this.filter;
    this.http.get(this.url).
      timeout(6000).
      map(res => res.json()).
      subscribe(data => {
        if (data.error == undefined) {
          if (this.success) {
            this.allposts = data.data;
          }
          else {
            this.error = "There is no Posts avaiable";
          }
        }

      },
        error => {
          console.log(error);
          this.load.dismiss();
          let alert = this.alertController.create({
            title: 'Oops!',
            subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
            buttons: ['Okay']
          });
          alert.present();
        }
      )


  }

  async openForm(postid,content){
  
    const alart = await this.alertController.create({
      title: 'Invitar A Debatir',
      inputs: [
        {
          name: 'email',
          type: 'email',
          label : 'Email',
          placeholder: 'Email'
        },
        {
          name: 'password', 
          type: 'password',
          label : 'Password',
          placeholder: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Submit',
          handler: data => {
              console.log("Email:",data.email);
              console.log("Password:",data.password);
              console.log("Post ID:",postid);
              this.inviteForDebate(data.email,data.password,postid,content);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alart.present();  
  }


  async openPasswordForm(postid){
    const alart = await this.alertController.create({
      title: 'Aceptar El Debate',
      inputs: [
        {
          name: 'password', 
          type: 'password',
          label : 'Password',
          placeholder: 'password'
        }
      ],
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
            console.log('Confirm Cancel');
          }
        }, {
          text: 'Submit',
          handler: data => {
              console.log("Password:",data.password);
              console.log("Post ID:",postid);
              this.matachPassword(data.password,postid);
            console.log('Confirm Ok');
          }
        }
      ]
    });
    await alart.present(); 
  }

  protected matachPassword(pass:any,pid:any){
    this.url = "http://www.reflexionesdelpastor.com/appadmin/checkPassword.php?password="+pass+"&postid="+pid;
    this.http.get(this.url).timeout(6000).
    map(res => res.json()).
    subscribe(data=>{
        if(data.error == undefined){
          this.success = data.success;
          if(this.success){
            this.debateComment = true;
            this.postid = pid;
            console.log('DebateComment:',this.debateComment);
            let alert = this.alertController.create({
              title: 'Congratulations',
              subTitle: 'Password Matched. You can take part in debate on this post',
              buttons: ['Okay']
            });
            alert.present();
          }else{
            let alert = this.alertController.create({
              title: "Warning",
              subTitle: 'Password does not match' ,
              buttons: ['Okay']
            });
            alert.present();
          }
        }

    })

  }

  protected inviteForDebate(email:string , password: string,pid:any,content:any){
    this.url = "http://www.reflexionesdelpastor.com/appadmin/inviteDebate.php?email="+email+"&password="+password+"&postid="+pid+"&content="+content;
    this.http.get(this.url).timeout(6000).
    map(res => res.json()).
    subscribe(data=>{
        if(data.error == undefined){
          this.success = data.success;
          if(this.success){
            let alert = this.alertController.create({
              title: 'Congratulations',
              subTitle: 'Invitation has been sent to user to take part in debate!',
              buttons: ['Okay']
            });
            alert.present();
          }
        }

    })
  }
  protected showcomments() {
    this.url = "http://www.reflexionesdelpastor.com/appadmin/getComments.php";
    this.http.get(this.url).
      timeout(6000).
      map(res => res.json()).
      subscribe(data => {
        if (data.error == undefined) {
          this.success = data.success;
          if (this.success) {
            console.log(data);
            this.allcomments = data.data;
            console.log(data.total);
           
            

            //this.splitName = name.charAt(0);

            // let char = this.splitName.split(1);
            // console.log("the char is:",char);

            //var str = "waleed"; 
            //var splitted = str.charAt(0); 


          }
          else {
            this.error = "There is no Free Ebook uploaded by Admin!";
          }
        }

      },
        error => {
          console.log(error);
          this.load.dismiss();
          let alert = this.alertController.create({
            title: 'Oops!',
            subTitle: 'There’s no network connection. Make sure you’re connected to a Wi-fi or mobile network and try again.',
            buttons: ['Okay']
          });
          alert.present();
        }
      )


  }

}

