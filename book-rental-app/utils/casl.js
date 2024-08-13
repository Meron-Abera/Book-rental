// utils/casl.js
import { AbilityBuilder, Ability } from '@casl/ability';

export const defineAbilitiesFor = (user) => {
  const { can, cannot, build } = new AbilityBuilder(Ability);

  if (user.role === 'admin') {
    can('manage', 'all');
  } else if (user.role === 'owner') {
    can('read', 'Book');
    can('create', 'Book');
    can('update', 'Book', { userId: user.id });
    can('delete', 'Book', { userId: user.id });
  } else {
    can('read', 'Book', { status: 'available' });
  }

  return build();
};
