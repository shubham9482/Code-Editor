import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
// import { AceEditorModule } from 'ng2-ace-editor/dist';
// import { NgxEditorModule } from 'ngx-editor';
// import { ChartsModule } from 'ng2-charts';
import {TimePickerComponent} from '../components/utility/time-picker/time-picker.component'

@NgModule({
  imports: [
    CommonModule
  ],
  declarations: [TimePickerComponent],
  exports : [TimePickerComponent]
})
export class SharedModule { }
