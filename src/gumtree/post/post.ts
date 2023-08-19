import { api } from '@/gumtree/api';

type PostGumTreeRequestType = {
  body: {
    src_code: string;
    dst_code: string;
  };
};

type PostGumTreeResponseType = {
  diff_id: number;
  status: 'success' | 'failure';
  diff_data: `/diff/${number}`;
  src_ast: `/ast/src/${number}`;
  dst_ast: `/ast/dst/${number}`;
  gumtree_output: `/output/${number}`;
  action: `/action/${number}`;
};

export async function postDiff({ body }: PostGumTreeRequestType) {
  const res = await api.post<PostGumTreeResponseType>('/post', { body });

  return { data: res.data };
}
