import { ImportType, QuotaStatus } from './types';

// Quota limits per user per day
const QUOTA_LIMITS: Record<ImportType, number> = {
  text: Infinity, // Unlimited
  url: 50,
  topic: 50,
  document: 20,
  video: 5,
  audio: 10
};

// File size limits
const FILE_SIZE_LIMITS: Record<ImportType, number> = {
  text: Infinity,
  url: Infinity,
  topic: Infinity,
  document: 50 * 1024 * 1024, // 50MB
  video: 100 * 1024 * 1024,   // 100MB
  audio: 10 * 1024 * 1024     // 10MB
};

// Duration limits (in seconds)
const DURATION_LIMITS: Record<ImportType, number> = {
  text: Infinity,
  url: Infinity,
  topic: Infinity,
  document: Infinity,
  video: 30 * 60,  // 30 minutes
  audio: 10 * 60   // 10 minutes
};

export class QuotaManager {
  private static instance: QuotaManager;
  private usage: Map<string, Map<ImportType, number>> = new Map();
  private resetDates: Map<string, Date> = new Map();

  static getInstance(): QuotaManager {
    if (!QuotaManager.instance) {
      QuotaManager.instance = new QuotaManager();
    }
    return QuotaManager.instance;
  }

  private getUserId(): string {
    // In a real app, this would come from the authenticated user
    // For now, we'll use a placeholder
    return 'current-user';
  }

  private isNewDay(userId: string): boolean {
    const lastReset = this.resetDates.get(userId);
    const now = new Date();
    
    if (!lastReset) {
      this.resetDates.set(userId, now);
      return true;
    }

    const isNewDay = now.toDateString() !== lastReset.toDateString();
    if (isNewDay) {
      this.resetDates.set(userId, now);
      // Reset usage for new day
      this.usage.set(userId, new Map());
    }

    return isNewDay;
  }

  checkQuota(type: ImportType, fileSize?: number, duration?: number): { allowed: boolean; reason?: string } {
    const userId = this.getUserId();
    this.isNewDay(userId);

    // Check usage quota
    const userUsage = this.usage.get(userId) || new Map();
    const currentUsage = userUsage.get(type) || 0;
    const limit = QUOTA_LIMITS[type];

    if (currentUsage >= limit) {
      return {
        allowed: false,
        reason: `Daily limit of ${limit} ${type} imports exceeded`
      };
    }

    // Check file size limit
    if (fileSize && fileSize > FILE_SIZE_LIMITS[type]) {
      return {
        allowed: false,
        reason: `File size exceeds ${Math.round(FILE_SIZE_LIMITS[type] / 1024 / 1024)}MB limit`
      };
    }

    // Check duration limit
    if (duration && duration > DURATION_LIMITS[type]) {
      return {
        allowed: false,
        reason: `Duration exceeds ${Math.round(DURATION_LIMITS[type] / 60)} minutes limit`
      };
    }

    return { allowed: true };
  }

  recordUsage(type: ImportType): void {
    const userId = this.getUserId();
    const userUsage = this.usage.get(userId) || new Map();
    const currentUsage = userUsage.get(type) || 0;
    userUsage.set(type, currentUsage + 1);
    this.usage.set(userId, userUsage);
  }

  getQuotaStatus(type: ImportType): QuotaStatus {
    const userId = this.getUserId();
    this.isNewDay(userId);

    const userUsage = this.usage.get(userId) || new Map();
    const used = userUsage.get(type) || 0;
    const limit = QUOTA_LIMITS[type];

    return {
      type,
      used,
      limit,
      resetDate: this.resetDates.get(userId) || new Date()
    };
  }

  getAllQuotaStatuses(): QuotaStatus[] {
    return Object.keys(QUOTA_LIMITS).map(type => 
      this.getQuotaStatus(type as ImportType)
    );
  }
}

export const quotaManager = QuotaManager.getInstance();
