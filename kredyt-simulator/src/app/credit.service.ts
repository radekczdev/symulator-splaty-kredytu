export interface Payment {
  month: number;
  principal: number;
  interest: number;
  balance: number;
  payment: number;
  extraPayment: number;
}

export function calculateSchedule(
  amount: number,
  months: number,
  wibor: number,
  margin: number,
  extraPayments: { [month: number]: number }
): Payment[] {
  const schedule: Payment[] = [];
  let balance = amount;
  const rate = (wibor + margin) / 1200; // miesięczna stopa
  const payment = (amount * rate) / (1 - Math.pow(1 + rate, -months));
  let m = 1;

  while (balance > 0.01 && m <= months) {
    const interest = balance * rate;
    let principal = payment - interest;
    let extra = extraPayments[m] || 0;
    if (principal + extra > balance) {
      principal = balance;
      extra = 0;
    }
    schedule.push({
      month: m,
      principal,
      interest,
      balance: balance - principal - extra,
      payment,
      extraPayment: extra,
    });
    balance -= (principal + extra);
    if (balance < 0.01) break;
    m++;
  }
  return schedule;
}
