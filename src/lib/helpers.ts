
import { v4 as uuidv4 } from 'uuid';

// Generate a UPI payment link with the team and tournament details
export function generateUpiLink(teamName: string, tournamentName: string, entryFee: number): string {
  const encodedTeamName = encodeURIComponent(teamName);
  const encodedTournamentName = encodeURIComponent(tournamentName);
  return `upi://pay?pa=9849834102@ybl&pn=Govardhan&am=${entryFee}&cu=INR&tn=Entry Fee for ${encodedTeamName} in ${encodedTournamentName}`;
}

// Generate a UUID for new documents
export function generateId(): string {
  return uuidv4();
}

// Format date for display
export function formatDate(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

// Format time for display
export function formatTime(dateString: string): string {
  const date = new Date(dateString);
  return date.toLocaleTimeString('en-US', {
    hour: '2-digit',
    minute: '2-digit'
  });
}

// Validate phone number (Indian format - 10 digits)
export function validatePhoneNumber(phone: string): boolean {
  const phoneRegex = /^[6-9]\d{9}$/;
  return phoneRegex.test(phone);
}

// Validate Free Fire UID (5-12 digits)
export function validateFFUID(uid: string): boolean {
  const uidRegex = /^\d{5,12}$/;
  return uidRegex.test(uid);
}
