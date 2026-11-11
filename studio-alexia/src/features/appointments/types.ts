export interface Appointment {
  id?: string;
  serviceId: number;
  startTime: Date;
  endTime: Date;
  clientName: string;
  clientContact: string;
}
