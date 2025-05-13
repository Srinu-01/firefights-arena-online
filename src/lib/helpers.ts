
import { v4 as uuidv4 } from 'uuid';

export const generateUpiLink = (teamName: string, tournamentName: string, amount: number) => {
  // UPI payment link format
  // pa = Payment Address
  // pn = Payee Name
  // am = Amount
  // cu = Currency
  // tn = Transaction Note
  
  const paymentAddress = "9849834102@ybl";
  const payeeName = "Govardhan";
  const currency = "INR";
  const transactionNote = `Entry Fee for ${teamName} | ${tournamentName}`;
  
  return `upi://pay?pa=${encodeURIComponent(paymentAddress)}&pn=${encodeURIComponent(payeeName)}&am=${amount}&cu=${currency}&tn=${encodeURIComponent(transactionNote)}`;
};

export const generateUniqueId = (): string => {
  return uuidv4();
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric', 
    month: 'short', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });
};
