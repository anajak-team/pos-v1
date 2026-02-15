
import { Transaction, StoreSettings, Shift, Product, RepairTicket, Expense, PurchaseOrder } from '../types';

const sendTelegramMessage = async (message: string, settings: StoreSettings) => {
  if (!settings.telegramBotToken || !settings.telegramChatId) {
    return;
  }

  try {
    const url = `https://api.telegram.org/bot${settings.telegramBotToken}/sendMessage`;
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: settings.telegramChatId,
        text: message,
        parse_mode: 'Markdown',
      }),
    });

    if (!response.ok) {
      console.error('Failed to send Telegram notification:', await response.text());
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
  }
};

export const sendSaleReport = async (transaction: Transaction, settings: StoreSettings) => {
  const { id, total, paymentMethod, items, customerName, date } = transaction;
  const currency = settings.currency;
  
  // Format items list
  const itemsList = items
    .map(item => `- ${item.quantity}x ${item.name} (${currency}${item.price.toLocaleString()})`)
    .join('\n');

  const message = `
*✅ New Sale!*
*Order:* #${id.slice(-6)}
*Time:* ${new Date(date).toLocaleTimeString()}
*Total:* ${currency}${total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
*Method:* ${paymentMethod.toUpperCase()}
${customerName ? `*Customer:* ${customerName}\n` : ''}
*Items:*
${itemsList}
  `.trim();

  await sendTelegramMessage(message, settings);
};

export const sendShiftReport = async (shift: Shift, type: 'OPEN' | 'CLOSED', settings: StoreSettings) => {
  const currency = settings.currency;
  let message = '';

  if (type === 'OPEN') {
    message = `
*🔓 Shift Opened*
*Manager:* ${shift.userName}
*Time:* ${new Date(shift.startTime).toLocaleString()}
*Opening Float:* ${currency}${shift.startingCash.toLocaleString()}
    `.trim();
  } else {
    const totalSales = (shift.cashSales || 0) + (shift.cardSales || 0) + (shift.digitalSales || 0);
    const payIn = shift.cashMovements?.filter(m => m.type === 'in').reduce((sum, m) => sum + m.amount, 0) || 0;
    const payOut = shift.cashMovements?.filter(m => m.type === 'out').reduce((sum, m) => sum + m.amount, 0) || 0;
    
    const expected = (shift.expectedCash || 0);
    const counted = (shift.countedCash || 0);
    const diff = (shift.difference || 0);

    message = `
*🔒 Shift Closed*
*Manager:* ${shift.userName}
*Time:* ${new Date(shift.endTime!).toLocaleString()}

*Financials:*
• Sales: ${currency}${totalSales.toLocaleString()}
• Pay In: ${currency}${payIn.toLocaleString()}
• Pay Out: ${currency}${payOut.toLocaleString()}

*Reconciliation:*
• Expected: ${currency}${expected.toLocaleString()}
• Counted: ${currency}${counted.toLocaleString()}
• Difference: ${diff > 0 ? '+' : ''}${currency}${diff.toLocaleString()} ${diff !== 0 ? (diff > 0 ? '(Overage)' : '(Shortage)') : '✅'}
    `.trim();
  }

  await sendTelegramMessage(message, settings);
};

export const sendProductReport = async (product: Product, type: 'ADD' | 'UPDATE' | 'DELETE', settings: StoreSettings) => {
  let actionIcon = '';
  let actionText = '';

  switch (type) {
    case 'ADD': actionIcon = '✨'; actionText = 'New Product Added'; break;
    case 'UPDATE': actionIcon = '📝'; actionText = 'Product Updated'; break;
    case 'DELETE': actionIcon = '🗑️'; actionText = 'Product Deleted'; break;
  }

  const message = `
*${actionIcon} ${actionText}*
*Name:* ${product.name}
*Category:* ${product.category}
*Price:* ${settings.currency}${product.price.toLocaleString()}
*Cost:* ${product.cost ? settings.currency + product.cost.toLocaleString() : 'N/A'}
*Stock:* ${product.stock} ${product.itemsPerCase && product.itemsPerCase > 1 ? `(Case: ${product.itemsPerCase})` : ''}
${product.zone ? `*Location:* ${product.zone}` : ''}
${type === 'DELETE' ? '' : `*Barcode:* ${product.barcode || 'N/A'}`}
${product.description ? `*Desc:* ${product.description}` : ''}
  `.trim();

  await sendTelegramMessage(message, settings);
};

export const sendRepairReport = async (ticket: RepairTicket, type: 'CREATE' | 'UPDATE', settings: StoreSettings) => {
  const message = `
*${type === 'CREATE' ? '🔧 New Repair Ticket' : '🛠️ Repair Status Update'}*
*Ticket:* #${ticket.id.slice(-6)}
*Customer:* ${ticket.customerName}
*Phone:* ${ticket.customerPhone}
*Device:* ${ticket.deviceName} ${ticket.serialNumber ? `(SN: ${ticket.serialNumber})` : ''}
*Issue:* ${ticket.issueDescription}

*Status:* ${ticket.status.toUpperCase()}
*Est. Cost:* ${settings.currency}${ticket.estimatedCost.toLocaleString()}
*Deposit:* ${settings.currency}${ticket.deposit.toLocaleString()}
${ticket.notes ? `*Notes:* ${ticket.notes}` : ''}
${type === 'UPDATE' ? `*Updated:* ${new Date().toLocaleString()}` : ''}
  `.trim();

  await sendTelegramMessage(message, settings);
};

export const sendExpenseReport = async (expense: Expense, type: 'ADD' | 'DELETE', settings: StoreSettings) => {
  if (type === 'DELETE') {
     const message = `
*🗑️ Expense Deleted*
*Desc:* ${expense.description}
*Amount:* ${settings.currency}${expense.amount.toLocaleString()}
     `.trim();
     await sendTelegramMessage(message, settings);
     return;
  }

  const message = `
*💸 New Expense Recorded*
*Category:* ${expense.category}
*Amount:* ${settings.currency}${expense.amount.toLocaleString()}
*Desc:* ${expense.description}
*Date:* ${expense.date}
  `.trim();

  await sendTelegramMessage(message, settings);
};

export const sendPurchaseReport = async (order: PurchaseOrder, settings: StoreSettings) => {
  const currency = settings.currency;
  const itemsList = order.items
    .map(item => `- ${item.quantity}x ${item.productName} @ ${currency}${item.unitCost.toLocaleString()}`)
    .join('\n');

  const message = `
*📦 New Purchase Order*
*Supplier:* ${order.supplierName}
*Status:* ${order.status}
*Total Cost:* ${currency}${order.totalCost.toLocaleString()}

*Items Ordered:*
${itemsList}
  `.trim();

  await sendTelegramMessage(message, settings);
};
