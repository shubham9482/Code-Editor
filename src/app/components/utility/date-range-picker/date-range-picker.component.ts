import { Component, OnInit,Input,Output,EventEmitter } from '@angular/core';
import * as moment from 'moment';
declare var $: any;

@Component({
  selector: 'app-date-range-picker',
  templateUrl: './date-range-picker.component.html',
  styleUrls: ['./date-range-picker.component.css']
})
export class DateRangePickerComponent implements OnInit {

  @Input() startDate;
  @Input() endDate;
  @Output() emitDate:EventEmitter<string>=new EventEmitter<string>();

  constructor() {
    var scope = this
    window.onbeforeunload = $(function () {

        // scope.startDate = moment().subtract(1, 'days');
        // scope.startDate = moment();

        function cb(start, end) {
          $('#reportrange span').html(start.format('MMMM D, YYYY') + ' - ' + end.format('MMMM D, YYYY'));
          scope.dateChange(start,end)
        }

        $('#reportrange').daterangepicker({
          startDate: scope.startDate,
          endDate: scope.endDate,
          ranges: {
            // 'Today': [moment(), moment()],
            // 'Yesterday': [moment().subtract(1, 'days'), moment().subtract(1, 'days')],
            'Last 7 Days': [moment().subtract(6, 'days'), moment()],
            'Last 30 Days': [moment().subtract(29, 'days'), moment()],
            'This Month': [moment().startOf('month'), moment().endOf('month')],
            'Last Month': [moment().subtract(1, 'month').startOf('month'), moment().subtract(1, 'month').endOf('month')]
          }
        }, cb);

        cb(scope.startDate, scope.endDate);

      });
   }

  ngOnInit() {
  }

  dateChange(startDate,endDate)
  {
    this.emitDate.emit(startDate.toString()+"split"+endDate.toString())
  }

  clearDate() {
    document.getElementById("reportrangeSpan").innerHTML = ""
    this.startDate=null;
    this.endDate=null
    this.emitDate.emit(null)
  }
}
