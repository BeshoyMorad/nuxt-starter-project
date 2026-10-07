import { useQuery, useMutation, useQueryClient } from '@tanstack/vue-query';

export interface Post {
  id: number;
  title: string;
  body: string;
  userId: number;
}

const fetchPosts = async (limit: number = 5): Promise<Post[]> => {
  const response = await fetch(`https://jsonplaceholder.typicode.com/posts?_limit=${limit}`);
  if (!response.ok) {
    throw new Error('Failed to fetch posts from network');
  }
  return response.json();
};

export const usePostsQuery = (limit: number = 5) => {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['posts', limit],
    queryFn: () => fetchPosts(limit),
    staleTime: 60 * 1000,
    gcTime: 5 * 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const addPostMutation = useMutation({
    mutationFn: async (newPost: Omit<Post, 'id'>) => {
      const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newPost),
      });
      return (await response.json()) as Post;
    },
    onSuccess: (createdPost) => {
      // Optimistically or explicitly update cache
      queryClient.setQueryData<Post[]>(['posts', limit], (old) => {
        return old ? [createdPost, ...old] : [createdPost];
      });
    },
  });

  return {
    ...query,
    addPostMutation,
  };
};
