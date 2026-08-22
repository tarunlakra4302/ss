/**
 * Server-side event catalog — single source of truth for ticket pricing.
 * Never trust client-supplied amounts for events listed here.
 */

export interface EventCatalogEntry {
  eventId: string;
  name: string;
  pricePerTicket: number; // INR
  maxQuantity: number;
  isActive: boolean;
}

export const EVENT_CATALOG: Record<string, EventCatalogEntry> = {
  "edible-gardening-workshop": {
    eventId: "edible-gardening-workshop",
    name: "Edible Gardening Workshop",
    pricePerTicket: 700,
    maxQuantity: 400,
    isActive: true,
  },
  "sustainable-market": {
    eventId: "sustainable-market",
    name: "Sustainable Market",
    pricePerTicket: 50,
    maxQuantity: 400,
    isActive: true,
  },
  "plogging": {
    eventId: "plogging",
    name: "Plogging",
    pricePerTicket: 30,
    maxQuantity: 400,
    isActive: true,
  },
};

/**
 * Look up an event by its eventId. Returns undefined if not found.
 */
export function getEvent(eventId: string): EventCatalogEntry | undefined {
  return EVENT_CATALOG[eventId];
}
