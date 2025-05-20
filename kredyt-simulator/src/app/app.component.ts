import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
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
    ReactiveFormsModule,
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
  form: FormGroup;
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
  lastFocusedMonth: number | null = null;

  @ViewChildren('nadplataInput') extraPaymentInputs!: QueryList<ElementRef>;

  constructor(private readonly fb: FormBuilder) {
    this.form = this.fb.group({
      amount: [300000, [Validators.required, Validators.min(1)]],
      months: [240, [Validators.required, Validators.min(1)]],
      wibor: [6.0, [Validators.required]],
      margin: [0, [Validators.required]],
      fillAllExtra: [0]
    });
  }

  calculate() {
    const { amount, months, wibor, margin, fillAllExtra } = this.form.value;
    this.amount = amount;
    this.months = months;
    this.wibor = wibor;
    this.margin = margin;
    this.fillAllExtra = fillAllExtra;
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

    this.kapital = this.schedule.reduce((s, p) => s + p.principal + p.extraPayment, 0);
    this.odsetki = this.schedule.reduce((s, p) => s + p.interest, 0);

    this.pieOptions = {
      title: { text: 'Kapitał / Odsetki', left: 'center' },
      tooltip: {
        trigger: 'item',
        formatter: '{a} <br/>{b}: {c} PLN ({d}%)'
      },
      legend: { bottom: 0 },
      series: [
        {
          name: 'Udział',
          type: 'pie',
          radius: '50%',
          data: [
            { value: Math.round(this.kapital), name: 'Kapitał' },
            { value: Math.round(this.odsetki), name: 'Odsetki' }
          ]
        }
      ]
    };

    // Schedule focus restoration after view updates
    setTimeout(() => this.restoreFocus(), 0);
  }

  // Aktualizacja nadpłaty w danym miesiącu z tabeli
  updateExtraPayment(month: number, value: string) {
    this.lastFocusedMonth = month;
    const val = parseFloat(value);
    if (!isNaN(val) && val >= 0) {
      this.extraPayments[month] = val;
    } else {
      delete this.extraPayments[month];
    }
    this.calculate();
  }

  // Restore focus to the last edited input
  restoreFocus() {
    if (this.lastFocusedMonth !== null) {
      const inputToFocus = this.extraPaymentInputs.find((item, index) => {
        const payment = this.schedule[index];
        return payment && payment.month === this.lastFocusedMonth;
      });

      if (inputToFocus) {
        inputToFocus.nativeElement.focus();
      }
    }
  }
}
