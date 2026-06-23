import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import doctorService from '../../../api/services/doctor.service';
import { mockReviews, mockStatistics } from '../data/mockReviews';

// TODO: Set to false when backend is ready
const USE_MOCK_DATA = false;

/**
 * Reviews Store - Zustand
 * Manages doctor reviews state and actions
 */
const useReviewsStore = create(
  devtools(
    (set, get) => ({
      // State
      reviews: [],
      statistics: null,
      selectedReview: null,

      // Pagination
      pagination: {
        pageNumber: 1,
        pageSize: 20,
        totalCount: 0,
        totalPages: 0,
        hasNextPage: false,
        hasPreviousPage: false
      },

      // Filters
      filters: {
        minRating: null,
        verifiedOnly: false,
        sortBy: 'date',
        sortOrder: 'desc'
      },

      // Loading states
      loading: {
        reviews: false,
        statistics: false,
        reply: false
      },

      // Error states
      error: {
        reviews: null,
        statistics: null,
        reply: null
      },

      // Actions

      /**
       * Fetch reviews with current filters and pagination
       */
      fetchReviews: async () => {
        const { pagination } = get();

        set((state) => ({
          loading: { ...state.loading, reviews: true },
          error: { ...state.error, reviews: null }
        }));

        try {
          console.log('📥 Fetching reviews:', { pageNumber: pagination.pageNumber, pageSize: pagination.pageSize });

          if (USE_MOCK_DATA) {
            // Use mock data
            console.log('🧪 Using mock reviews data');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 500));

            // Pagination logic for mock data
            const startIndex = (pagination.pageNumber - 1) * pagination.pageSize;
            const endIndex = startIndex + pagination.pageSize;
            const paginatedReviews = mockReviews.slice(startIndex, endIndex);

            set({
              reviews: paginatedReviews.map(r => ({
                ...r,
                reviewId: r.id,
                patientName: r.patient?.fullName || 'مريض',
                hasDoctorReply: !!r.doctorReply
              })),
              pagination: {
                pageNumber: pagination.pageNumber,
                pageSize: pagination.pageSize,
                totalCount: mockReviews.length,
                totalPages: Math.ceil(mockReviews.length / pagination.pageSize),
                hasNextPage: endIndex < mockReviews.length,
                hasPreviousPage: pagination.pageNumber > 1
              },
              loading: { ...get().loading, reviews: false }
            });

            console.log('✅ Mock reviews loaded');
            return;
          }

          const response = await doctorService.getReviews(pagination.pageNumber, pagination.pageSize);

          console.log('✅ Reviews fetched:', response);

          if (response) {
            set({
              reviews: response.data || [],
              pagination: {
                pageNumber: response.pageNumber || 1,
                pageSize: response.pageSize || 10,
                totalCount: response.totalCount || 0,
                totalPages: response.totalPages || 0,
                hasNextPage: response.hasNextPage || false,
                hasPreviousPage: response.hasPreviousPage || false
              },
              loading: { ...get().loading, reviews: false }
            });
          }
        } catch (error) {
          console.error('❌ Error fetching reviews:', error);
          set((state) => ({
            loading: { ...state.loading, reviews: false },
            error: { ...state.error, reviews: error.message || 'فشل في جلب التقييمات' }
          }));
        }
      },

      /**
       * Fetch review statistics
       */
      fetchStatistics: async () => {
        set((state) => ({
          loading: { ...state.loading, statistics: true },
          error: { ...state.error, statistics: null }
        }));

        try {
          console.log('📊 Fetching review statistics...');

          if (USE_MOCK_DATA) {
            // Use mock statistics
            console.log('🧪 Using mock statistics data');

            // Simulate API delay
            await new Promise(resolve => setTimeout(resolve, 300));

            set({
              statistics: mockStatistics,
              loading: { ...get().loading, statistics: false }
            });

            console.log('✅ Mock statistics loaded');
            return;
          }

          const statistics = await doctorService.getReviewStatistics();

          console.log('✅ Statistics fetched:', statistics);

          set({
            statistics,
            loading: { ...get().loading, statistics: false }
          });
        } catch (error) {
          console.error('❌ Error fetching statistics:', error);
          set((state) => ({
            loading: { ...state.loading, statistics: false },
            error: { ...state.error, statistics: error.message || 'فشل في جلب الإحصائيات' }
          }));
        }
      },

      /**
       * Set minimum rating filter (client-side filtering)
       */
      setMinRatingFilter: (minRating) => {
        set((state) => ({
          filters: { ...state.filters, minRating }
        }));
      },

      /**
       * Reset all filters
       */
      resetFilters: () => {
        set({
          filters: {
            minRating: null,
            verifiedOnly: false,
            sortBy: 'date',
            sortOrder: 'desc'
          }
        });
      },

      /**
       * Go to next page
       */
      goToNextPage: () => {
        const { pagination } = get();
        if (pagination.hasNextPage) {
          set((state) => ({
            pagination: { ...state.pagination, pageNumber: pagination.pageNumber + 1 }
          }));
          get().fetchReviews();
        }
      },

      /**
       * Go to previous page
       */
      goToPreviousPage: () => {
        const { pagination } = get();
        if (pagination.hasPreviousPage) {
          set((state) => ({
            pagination: { ...state.pagination, pageNumber: pagination.pageNumber - 1 }
          }));
          get().fetchReviews();
        }
      },

      /**
       * Fetch review details by ID
       */
      fetchReviewDetails: async (reviewId) => {
        set((state) => ({
          loading: { ...state.loading, reply: true },
          error: { ...state.error, reply: null }
        }));

        try {
          console.log('📄 Fetching review details:', reviewId);

          if (USE_MOCK_DATA) {
            // Find review in mock data
            const reviewDetails = mockReviews.find(r => r.id === reviewId);

            if (reviewDetails) {
              set({
                selectedReview: { ...reviewDetails, reviewId: reviewDetails.id },
                loading: { ...get().loading, reply: false }
              });

              console.log('✅ Mock review details loaded');
              return { success: true, data: reviewDetails };
            } else {
              throw new Error('Review not found');
            }
          }

          const reviewDetails = await doctorService.getReviewDetails(reviewId);

          console.log('✅ Review details fetched:', reviewDetails);

          set({
            selectedReview: reviewDetails,
            loading: { ...get().loading, reply: false }
          });

          return { success: true, data: reviewDetails };
        } catch (error) {
          console.error('❌ Error fetching review details:', error);
          set((state) => ({
            loading: { ...state.loading, reply: false },
            error: { ...state.error, reply: error.message || 'فشل في جلب تفاصيل التقييم' }
          }));

          return { success: false, error: error.message };
        }
      },

      /**
       * Set selected review for details modal
       */
      setSelectedReview: (review) => {
        set({ selectedReview: review });
      },

      /**
       * Clear errors
       */
      clearError: (errorType) => {
        set((state) => ({
          error: { ...state.error, [errorType]: null }
        }));
      },

      /**
       * Reset store
       */
      reset: () => {
        set({
          reviews: [],
          statistics: null,
          selectedReview: null,
          pagination: {
            pageNumber: 1,
            pageSize: 20,
            totalCount: 0,
            totalPages: 0,
            hasNextPage: false,
            hasPreviousPage: false
          },
          filters: {
            minRating: null,
            verifiedOnly: false,
            sortBy: 'date',
            sortOrder: 'desc'
          },
          loading: {
            reviews: false,
            statistics: false,
            reply: false
          },
          error: {
            reviews: null,
            statistics: null,
            reply: null
          }
        });
      }
    }),
    {
      name: 'reviews-store',
      partialize: (state) => ({
        filters: state.filters,
        pagination: { ...state.pagination, pageNumber: 1 } // Don't persist page number
      })
    }
  )
);

export default useReviewsStore;
