import { api } from '@/services/gumtree';

type PostGumTreeRequestType = {
  body: {
    src_code: string;
    dst_code: string;
  };
};

type PostGumTreeResponseType = {
  diff_id: number;
  status: 'success' | 'failed';
  diff_data: `/diff/${number}`;
  src_ast: `/ast/src/${number}`;
  dst_ast: `/ast/dst/${number}`;
  gumtree_output: `/output/${number}`;
  action: `/action/${number}`;
};

export async function postDiff({ body }: PostGumTreeRequestType) {
  try {
    const res = await api.post<PostGumTreeResponseType>('/post', { ...body });

    if (res.status === 200) return { data: res.data };

    return null;
  } catch (e) {
    console.error(e);
  }
}
