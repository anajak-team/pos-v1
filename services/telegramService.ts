
import { Transaction, StoreSettings } from '../types';

export const sendSaleReport = async (transaction: Transaction, settings: StoreSettings) => {
  if (!settings.telegramBotToken || !settings.telegramChatId) {
    return;
  }

  const { id, total, paymentMethod, items, customerName, date } = transaction;
  const currency = settings.currency;
  
  // Format items list
  const itemsList = items
    .map(item => `- ${item.quantity}x ${item.name} (${currency}${item.price.toLocaleString()})`)
    .join('\n');

  // Construct message with Markdown
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
