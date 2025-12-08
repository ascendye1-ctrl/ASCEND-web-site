
import React, { useState } from 'react';
import { Star, ThumbsUp, User } from 'lucide-react';
import { Review, Language } from '../types';
import { translations } from '../utils/translations';

interface ReviewsListProps {
  reviews: Review[];
  language: Language;
  onAddReview?: (review: Omit<Review, 'id' | 'date'>) => void;
}

const ReviewsList: React.FC<ReviewsListProps> = ({ reviews, language, onAddReview }) => {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isFormVisible, setIsFormVisible] = useState(false);
  const t = translations[language].reviews;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onAddReview && rating > 0) {
      onAddReview({
        userName: t.guestUser, // Use translation for guest name if adding locally
        rating,
        comment,
        type: 'product'
      });
      setRating(0);
      setComment('');
      setIsFormVisible(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-xl font-bold text-gray-900 dark:text-white">{t.title}</h3>
        <button 
          onClick={() => setIsFormVisible(!isFormVisible)}
          className="text-brand-navy dark:text-brand-lime font-medium hover:underline"
        >
          {isFormVisible ? t.cancel : t.write}
        </button>
      </div>

      {isFormVisible && (
        <form onSubmit={handleSubmit} className="bg-gray-50 dark:bg-slate-800 p-6 rounded-xl border border-gray-100 dark:border-slate-700">
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.rating}</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  onClick={() => setRating(star)}
                  className="focus:outline-none transition-transform hover:scale-110"
                >
                  <Star className={`w-6 h-6 ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`} />
                </button>
              ))}
            </div>
          </div>
          <div className="mb-4">
            <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-2">{t.comment}</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-200 dark:border-slate-600 bg-white dark:bg-slate-900 focus:ring-2 focus:ring-brand-navy outline-none"
              rows={3}
              placeholder={t.placeholder}
              required
            />
          </div>
          <button 
            type="submit" 
            className="px-6 py-2 bg-brand-navy text-white rounded-lg font-bold hover:bg-brand-navy/90 transition-colors"
            disabled={rating === 0}
          >
            {t.submit}
          </button>
        </form>
      )}

      <div className="space-y-6">
        {reviews.length === 0 ? (
          <p className="text-gray-500 italic">{t.noReviews}</p>
        ) : (
          reviews.map((review) => (
            <div key={review.id} className="border-b border-gray-100 dark:border-slate-800 pb-6 last:border-0">
              <div className="flex justify-between items-start mb-2">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center">
                    <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                  </div>
                  <div>
                    {/* Display mock username directly, but if it was dynamic 'Guest User' we could swap it. 
                        For now, assuming review.userName comes from DB. 
                    */}
                    <h4 className="font-bold text-gray-900 dark:text-white text-sm">{review.userName}</h4>
                    <div className="flex items-center gap-2 text-xs text-gray-500">
                      <span>{review.date}</span>
                      {review.type === 'merchant' && <span className="px-1.5 py-0.5 bg-blue-100 text-blue-700 rounded text-[10px] font-bold">{t.storeReview}</span>}
                    </div>
                  </div>
                </div>
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className={`w-4 h-4 ${i < review.rating ? 'fill-current' : 'text-gray-200 dark:text-slate-700'}`} />
                  ))}
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300 text-sm leading-relaxed mt-2">{review.comment}</p>
              <div className="mt-3 flex items-center gap-4">
                <button className="flex items-center gap-1 text-xs text-gray-400 hover:text-brand-navy transition-colors">
                  <ThumbsUp className="w-3 h-3" /> {t.helpful}
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ReviewsList;
