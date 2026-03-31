export let availabilityData: any = {};
export let bookings: any[] = [];

export function setAvailability(data: any) {
  availabilityData = data;
}

export function getAvailability() {
  return availabilityData;
}

export function addBooking(data: any) {
  bookings.push(data);
}

export function getBookings() {
  return bookings;
}