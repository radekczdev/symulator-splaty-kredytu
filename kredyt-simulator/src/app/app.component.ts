import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import {NgxEchartsDirective, provideEchartsCore} from 'ngx-echarts';
import * as echarts from 'echarts/core';
import { PieChart } from 'echarts/charts';
import { TitleComponent, TooltipComponent, LegendComponent } from 'echarts/components';
import { CanvasRenderer } from 'echarts/renderers';
import { calculateSchedule, Payment } from './credit.service';

// Angular Material imports
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatToolbarModule } from '@angular/material/toolbar';


echarts.use([PieChart, TitleComponent, TooltipComponent, LegendComponent, CanvasRenderer]);

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    NgxEchartsDirective,
    MatToolbarModule,
    MatInputModule,
    MatButtonModule,
    MatTableModule,
    MatCardModule
  ],
  providers: [
    provideEchartsCore({ echarts })
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  amount = 300000;
  months = 240;
  wibor = 6.0;
  margin = 2.0;
  extraPayments: { [month: number]: number } = {};
  schedule: Payment[] = [];
  kapital = 0;
  odsetki = 0;
  pieOptions: any = {};
  fillAllExtra = 0;

  calculate() {
    // Jeśli ustawiono fillAllExtra, wypełnij wszystkie miesiące tą kwotą
    if (this.fillAllExtra > 0) {
      this.extraPayments = {};
      for (let m = 1; m <= this.months; m++) {
        this.extraPayments[m] = this.fillAllExtra;
      }
    }
    // W przeciwnym razie zachowaj indywidualne nadpłaty

    this.schedule = calculateSchedule(
      this.amount,
      this.months,
      this.wibor,
      this.margin,
      this.extraPayments
    );
    this.kapital = this.schedule.reduce((s, p) => s + p.principal, 0);
    this.odsetki = this.schedule.reduce((s, p) => s + p.interest, 0);
    this.pieOptions = {
      title: { text: 'Kapitał / Odsetki', left: 'center' },
      tooltip: { trigger: 'item' },
      legend: { bottom: 0 },
      series: [
        {
          name: 'Udział',
          type: 'pie',
          radius: '50%',
          data: [
            { value: this.kapital, name: 'Kapitał' },
            { value: this.odsetki, name: 'Odsetki' }
          ]
        }
      ]
    };
  }

  // Aktualizacja nadpłaty w danym miesiącu z tabeli
  updateExtraPayment(month: number, value: string) {
    const val = parseFloat(value);
    if (!isNaN(val) && val >= 0) {
      this.extraPayments[month] = val;
    } else {
      delete this.extraPayments[month];
    }
    this.calculate();
  }
}
