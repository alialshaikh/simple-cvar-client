
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component } from '@angular/core';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'CVaR Client';
  selectedFile_Name="";
  selectedConf=0.99;
  isProg=false;
  isDone=false;
  isError=false;
  resultVal="";

  errorMsg="";
  
  constructor(private http: HttpClient) { 
    
  }


validate=(inVal:any)=>['Backspace','.'].includes(inVal.key) || inVal.key.match("[0123456789]")!==null;

fileSelected(f:any){
  if(f[0].name)
  this.selectedFile_Name=f[0].name;
}

submit(myfilecontrol:HTMLInputElement,cutoffInput:HTMLInputElement){

  this.selectedConf=Number(cutoffInput.value);
  
  this.isDone=false;this.isError=false;
  let is_input_error=this.validateAgain();
  if(!is_input_error && myfilecontrol.files && myfilecontrol.files.length>0)
  {
      this.isProg=true;
      let url='https://cvar-service-sbz36w5qoq-ey.a.run.app';

      const formData = new FormData();
      //console.log(this.selectedConf.toString())
      formData.append('file',myfilecontrol.files[0],myfilecontrol.files[0].name);
      formData.append('cutoff',this.selectedConf.toString());
      this.http.post(url,formData).subscribe({
        next:(v:any)=>{
          this.resultVal=v.toLocaleString("en-US");;
          this.isDone=true;
          this.isProg=false;
          //console.log(v);
        }
        ,error:(er)=>{
          this.isProg=false;
          this.isError=true;
          this.errorMsg="An error occured. Please check your Excel file";
        }
      });
  }

}

validateAgain(){
  this.errorMsg="";
  if(!Number(this.selectedConf))
  {
    this.errorMsg="The confidence value is not correct"
  }
  else if (Number(this.selectedConf)<0 || Number(this.selectedConf)>=1)
  {
    this.errorMsg="The confidence value should be between 0 and 1"
  }
  else if (this.selectedFile_Name==""){
    this.errorMsg="No Excel file is selected";
  }
  return this.isError=this.errorMsg!="";

}


}
