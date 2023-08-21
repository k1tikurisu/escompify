import { api } from '@/services/gumtree';
import { Node } from 'estree';

export type ActionType = {
  type: 'insert' | 'move' | 'update' | 'delete';
  action:
    | `inser-${'node' | 'tree'}`
    | `move-${'node' | 'tree'}`
    | `update-${'node' | 'tree'}`
    | `delete-${'node' | 'tree'}`;
  src: ActionDetailsType;
  dst: ActionDetailsType;
};

type ActionDetailsType = {
  path: Array<string | number>;
  node: Node;
};

export async function getAction(id: number) {
  const res = await api.get<ActionType[]>(`/action/${id}`);

  return { data: res.data };
}
