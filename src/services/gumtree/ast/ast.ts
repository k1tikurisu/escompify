import { api } from '@/services/gumtree';
import { Node } from '@babel/core';

type GetAstRequestType = {
  id: number;
  type: 'src' | 'dst';
};

export async function getAst({ id, type }: GetAstRequestType) {
  try {
    const res = await api.get<Node>(`/ast/${type}/${id}`);

    if (res.status === 200) return { data: res.data };

    return null;
  } catch (e) {
    console.error(e);
  }
}
