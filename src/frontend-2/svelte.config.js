import adapter from '@sveltejs/adapter-node';

export default {
  kit: {
    adapter: adapter({
      pages: 'build',
      assets: 'build',
      fallback: 'index.html'
    }),
  }
};
