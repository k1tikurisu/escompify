import ky from 'ky';

// entrypoint
export const api = ky.create({ prefixUrl: 'http://localhost:8000' });

// endpoints
export { postDiff } from '@/gumtree/post/post';
export { getAction } from '@/gumtree/action/action';
export { getAst } from '@/gumtree/ast/ast';
