import axios from 'axios';

// entrypoint
export const api = axios.create({
  baseURL: 'http://localhost:8000',
  headers: {
    'Content-Type': 'application/json'
  }
});

// endpoints
export { postDiff } from '@/gumtree/post/post';
export { getAction } from '@/gumtree/action/action';
export { getAst } from '@/gumtree/ast/ast';
