export interface Appointment {
    id: number;
    short_description: string;
    full_description: string;
    starton: string;
    finishedon: string;
  }
  
export interface ApiResponse {
    success: boolean;
    data: Appointment[];
  }
  