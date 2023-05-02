export interface IEventFormData {
  title?: string;
  startDate?: Date;
  endDate?: Date;
  startTime?: string;
  endTime?: string;
  location?: string;
  description?: string;
}

export interface IEventDateInput {
  text?: string;
  date?: Date;
}
