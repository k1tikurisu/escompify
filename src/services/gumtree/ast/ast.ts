import { api } from '@/services/gumtree';
import { Program } from 'estree';

type GetAstRequestType = {
  id: number;
  type: 'src' | 'dst';
};

export async function getAst({ id, type }: GetAstRequestType) {
  try {
    const res = await api.get<Program>(`/ast/${type}/${id}`);

    if (res.status === 200) return { data: res.data };

    return null;
  } catch (e) {
    console.error(e);
  }
}
