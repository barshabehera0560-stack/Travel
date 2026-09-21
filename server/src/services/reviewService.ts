import { prisma } from '../config/prisma.js';
import { AppError } from '../middlewares/errorHandler.js';

export interface CreateReviewInput {
  userId: string;
  destinationId: string;
  rating: number;
  comment: string;
  travelerType: string;
  photos?: string[];
}

export class ReviewService {
  static async createReview(input: CreateReviewInput) {
    const { userId, destinationId, rating, comment, travelerType, photos } = input;

    if (rating < 1 || rating > 5) {
      throw new AppError('Rating must be between 1 and 5 stars.', 400);
    }

    if (!comment || comment.trim().length < 5) {
      throw new AppError('Comment must be at least 5 characters long.', 400);
    }

    // Basic spam/profanity check
    const forbidden = ['fake', 'scam', 'spam'];
    const hasForbidden = forbidden.some((w) => comment.toLowerCase().includes(w));
    if (hasForbidden) {
      throw new AppError('Review comment contains prohibited content.', 400);
    }

    const review = await prisma.review.create({
      data: {
        userId,
        destinationId,
        rating,
        comment: comment.trim(),
        travelerType: travelerType || 'Solo',
        photos: photos && photos.length > 0 ? JSON.stringify(photos) : null,
      },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
    });

    // Recalculate average rating & review count for the destination
    const aggregate = await prisma.review.aggregate({
      where: { destinationId },
      _avg: { rating: true },
      _count: { rating: true },
    });

    if (aggregate._avg.rating !== null) {
      await prisma.destination.update({
        where: { id: destinationId },
        data: {
          rating: Math.round(aggregate._avg.rating * 10) / 10,
          reviewCount: aggregate._count.rating,
        },
      });
    }

    return review;
  }

  static async getDestinationReviews(destinationId: string) {
    return prisma.review.findMany({
      where: { destinationId },
      include: {
        user: {
          select: { id: true, name: true },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
