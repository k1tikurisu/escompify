import { api } from '@/services/gumtree';
import { Node } from 'estree';

type ActionType = {
  type: 'insert' | 'move' | 'update' | 'delete';
  action: 'insert-node' | 'move-node' | 'update-node' | 'delete-node';
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
