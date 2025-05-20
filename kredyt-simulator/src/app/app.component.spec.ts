import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule, FormBuilder } from '@angular/forms';
import { AppComponent } from './app.component';
import { By } from '@angular/platform-browser';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AppComponent],
      imports: [ReactiveFormsModule],
      providers: [FormBuilder]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.value.amount).toBe(300000);
    expect(component.form.value.months).toBe(240);
    expect(component.form.value.wibor).toBe(6.0);
    expect(component.form.value.margin).toBe(0);
    expect(component.form.value.fillAllExtra).toBe(0);
  });

  it('should update component properties on calculate', () => {
    component.form.setValue({
      amount: 100000,
      months: 120,
      wibor: 5.5,
      margin: 1.5,
      fillAllExtra: 0
    });
    component.calculate();
    expect(component.amount).toBe(100000);
    expect(component.months).toBe(120);
    expect(component.wibor).toBe(5.5);
    expect(component.margin).toBe(1.5);
    expect(component.fillAllExtra).toBe(0);
  });

  it('should fill all extraPayments if fillAllExtra > 0', () => {
    component.form.setValue({
      amount: 100000,
      months: 12,
      wibor: 5.5,
      margin: 1.5,
      fillAllExtra: 1000
    });
    component.calculate();
    expect(Object.keys(component.extraPayments).length).toBe(12);
    for (let m = 1; m <= 12; m++) {
      expect(component.extraPayments[m]).toBe(1000);
    }
  });

  it('should not fill extraPayments if fillAllExtra is 0', () => {
    component.extraPayments = {1: 500, 2: 200};
    component.form.setValue({
      amount: 100000,
      months: 12,
      wibor: 5.5,
      margin: 1.5,
      fillAllExtra: 0
    });
    component.calculate();
    expect(component.extraPayments[1]).toBe(500);
    expect(component.extraPayments[2]).toBe(200);
  });

  // Add more tests for edge cases and schedule calculation as needed
});

