import { api } from '@/gumtree/api';
import { Program } from 'estree';

type GetAstRequestType = {
  id: number;
  type: 'src' | 'dst';
};

export async function getAst({ id, type }: GetAstRequestType) {
  const res = await api.get(`/ast/${type}/${id}`).json<Program>();

  return { data: res };
}
