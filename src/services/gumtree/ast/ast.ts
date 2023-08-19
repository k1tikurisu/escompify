import { api } from '@/services/gumtree';
import { Program } from 'estree';

type GetAstRequestType = {
  id: number;
  type: 'src' | 'dst';
};

export async function getAst({ id, type }: GetAstRequestType) {
  const res = await api.get<Program>(`/ast/${type}/${id}`);

  return { data: res.data };
}
