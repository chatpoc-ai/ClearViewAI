export enum AppState {
  IDLE = 'IDLE',
  PREVIEW = 'PREVIEW',
  PROCESSING = 'PROCESSING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}

export interface ProcessingOptions {
  aggressiveness: number; // 0-100
  detectOnly: boolean;
}

export interface ProcessingResult {
  originalImage: string; // Base64
  processedImage: string | null; // Base64
  detectionOverlay?: string | null; // Base64 mask (optional)
}

export type AlertType = 'success' | 'error' | 'info';

export interface AlertMessage {
  type: AlertType;
  message: string;
}
